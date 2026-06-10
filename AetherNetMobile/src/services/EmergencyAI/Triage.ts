import { Protocol, PROTOCOLS } from './protocols';

export function detectImmediateThreat(query: string): Protocol | null {
  const normalizedQuery = query.toLowerCase();

  const cardiacPatterns = ['not breathing', 'no pulse', 'no heartbeat', 'stopped breathing'];
  const breathPatterns = ['choking cannot breathe', 'blue lips', 'airway blocked'];
  const bleedPatterns = ['gushing blood', 'spurting blood', 'blood not stopping'];
  const disasPatterns = ['trapped rubble', 'building collapsed on'];

  if (cardiacPatterns.some(pattern => normalizedQuery.includes(pattern))) {
    return PROTOCOLS.find(p => p.id === 'CARDIAC_001') || null;
  }
  
  if (breathPatterns.some(pattern => normalizedQuery.includes(pattern))) {
    return PROTOCOLS.find(p => p.id === 'BREATH_001') || null;
  }
  
  if (bleedPatterns.some(pattern => normalizedQuery.includes(pattern))) {
    return PROTOCOLS.find(p => p.id === 'BLEED_001') || null;
  }
  
  if (disasPatterns.some(pattern => normalizedQuery.includes(pattern))) {
    return PROTOCOLS.find(p => p.id === 'DISAS_001') || null;
  }

  return null;
}

export function formatTimestamp(): string {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
