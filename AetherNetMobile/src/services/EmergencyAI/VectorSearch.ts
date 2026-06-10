import { Protocol, PROTOCOLS } from './protocols';

function stem(word: string): string {
  let w = word;
  if (w.length <= 4) return w;
  if (w.endsWith('ing')) return w.slice(0, -3);
  if (w.endsWith('ed')) return w.slice(0, -2);
  if (w.endsWith('es')) return w.slice(0, -2);
  if (w.endsWith('s') && !w.endsWith('ss')) return w.slice(0, -1);
  return w;
}

export function buildVocabulary(protocols: Protocol[]): { vocab: string[], idf: number[] } {
  const docFreq: Record<string, number> = {};
  
  for (const protocol of protocols) {
    // Combine title and keywords
    const allText = protocol.title + ' ' + protocol.keywords.join(' ');
    const tokens = allText.toLowerCase().split(/\s+/);
    
    const uniqueTokens = new Set<string>();
    for (const token of tokens) {
      const cleanWord = token.replace(/[^a-z0-9]/g, '');
      if (cleanWord.length > 2) {
        uniqueTokens.add(stem(cleanWord));
      }
    }
    
    uniqueTokens.forEach(t => {
      docFreq[t] = (docFreq[t] || 0) + 1;
    });
  }
  
  const vocab = Object.keys(docFreq);
  const N = protocols.length;
  // IDF = log(N / DF)
  // We add 1.0 to baseline so even common words have some weight
  const idf = vocab.map(w => 1.0 + Math.log(N / docFreq[w]));
  
  return { vocab, idf };
}

export const { vocab: vocabulary, idf } = buildVocabulary(PROTOCOLS);

// Returns a weighted vector
export function textToVector(text: string, vocab: string[], idfWeights: number[]): number[] {
  const vector = new Array(vocab.length).fill(0);
  const tokens = text.toLowerCase().split(/\s+/);
  
  for (const token of tokens) {
    const cleanWord = token.replace(/[^a-z0-9]/g, '');
    if (cleanWord.length > 2) {
      const stemmed = stem(cleanWord);
      const index = vocab.indexOf(stemmed);
      if (index !== -1) {
        // Simple TF=1 for any occurrence, multiplied by IDF
        vector[index] = idfWeights[index];
      }
    }
  }
  return vector;
}

export const protocolVectors: number[][] = PROTOCOLS.map(p => 
  textToVector(p.title + ' ' + p.keywords.join(' '), vocabulary, idf)
);

export function searchProtocols(query: string, topN: number = 3): Array<{ protocol: Protocol, score: number }> {
  // We want to calculate the overlap but weighted by IDF
  const queryVector = textToVector(query, vocabulary, idf);
  
  // Calculate maximum possible score for this query (if a protocol matched all query words)
  let maxPossibleScore = 0;
  for (const val of queryVector) {
    maxPossibleScore += val;
  }
  
  if (maxPossibleScore === 0) return [];
  
  const results = PROTOCOLS.map((protocol, index) => {
    let score = 0;
    const pVec = protocolVectors[index];
    
    for (let i = 0; i < queryVector.length; i++) {
      if (queryVector[i] > 0 && pVec[i] > 0) {
        // If both query and protocol have the word, add the word's IDF weight to the score
        score += queryVector[i];
      }
    }
    
    // Normalize score to a 0.0 - 1.0 percentage
    return { protocol, score: score / maxPossibleScore };
  });
  
  return results
    .filter(r => r.score >= 0.25) // Minimum 25% weighted match
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);
}

export function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'CRITICAL': return '#ff4444';
    case 'URGENT': return '#ff8800';
    case 'STABLE': return '#00bb44';
    default: return '#666666';
  }
}
