const supabase = require('../config/supabase');

// @route POST /api/ratings/:sosId
const submitRating = async (req, res) => {
    try {
        const { responderId, stars, review } = req.body;
        const sosId = req.params.sosId;
        if (!responderId || !stars || stars < 1 || stars > 5) {
            return res.status(400).json({ message: 'Please provide responderId and a valid star rating (1-5)' });
        }

        const { data: sos } = await supabase.from('sos').select('*').eq('id', sosId).single();
        if (!sos) return res.status(404).json({ message: 'SOS not found' });
        if (sos.seeker_id !== req.user.id) return res.status(403).json({ message: 'Not authorized: must be the seeker' });
        if (sos.status !== 'resolved') return res.status(400).json({ message: 'SOS must be resolved before rating' });
        if (!(sos.responders || []).includes(responderId)) return res.status(400).json({ message: 'User was not a responder for this SOS' });

        const { data: existing } = await supabase.from('ratings')
            .select('id').eq('sos_id', sosId).eq('seeker_id', req.user.id).eq('responder_id', responderId).single();
        if (existing) return res.status(400).json({ message: 'You have already rated this responder for this SOS' });

        const { data: rating } = await supabase.from('ratings').insert({
            sos_id: sosId, seeker_id: req.user.id, responder_id: responderId, stars, review
        }).select().single();

        // Update trust score
        const { data: responder } = await supabase.from('users').select('rating_sum, total_ratings').eq('id', responderId).single();
        if (responder) {
            const newSum = (responder.rating_sum || 0) + stars;
            const newCount = (responder.total_ratings || 0) + 1;
            const newScore = Math.round((newSum / newCount) * 10) / 10;
            await supabase.from('users').update({ rating_sum: newSum, total_ratings: newCount, trust_score: newScore }).eq('id', responderId);
        }
        res.status(201).json({ rating });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @route GET /api/ratings/responder/:userId
const getResponderRatings = async (req, res) => {
    try {
        const { data: ratings } = await supabase.from('ratings')
            .select('*, sos!ratings_sos_id_fkey(type), users!ratings_seeker_id_fkey(name)')
            .eq('responder_id', req.params.userId).order('created_at', { ascending: false });

        const { data: user } = await supabase.from('users').select('trust_score, total_ratings').eq('id', req.params.userId).single();
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json({ ratings: ratings || [], averageScore: user.trust_score, totalCount: user.total_ratings });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { submitRating, getResponderRatings };
