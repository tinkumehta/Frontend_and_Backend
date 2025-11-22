import natural from 'natural';

const { WordTokenizer, PorterStemmer } = natural;
const tokenizer = new WordTokenizer();

// Keyword-based categorization
const categoryKeywords = {
  complaint: ['broken', 'not working', 'terrible', 'awful', 'horrible', 'angry', 'frustrated', 'disappointed', 'bad', 'poor', 'issue', 'problem'],
  question: ['how', 'what', 'when', 'where', 'why', 'can i', 'should i', '?', 'help with', 'information'],
  request: ['please', 'can you', 'could you', 'would you', 'need help', 'assistance', 'support'],
  feedback: ['thanks', 'thank you', 'great', 'awesome', 'amazing', 'love', 'good', 'excellent', 'suggestion', 'feedback']
};

// Priority detection keywords
const priorityKeywords = {
  urgent: ['urgent', 'asap', 'emergency', 'critical', 'immediately', 'right now', 'broken', 'not working', 'down'],
  high: ['important', 'need help', 'issue', 'problem', 'frustrated', 'angry']
};

export class NLPService {
  static categorizeMessage(message) {
    const text = message.toLowerCase();
    let scores = {
      complaint: 0,
      question: 0,
      request: 0,
      feedback: 0,
      other: 0
    };

    // Keyword matching
    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      scores[category] = keywords.filter(keyword => text.includes(keyword)).length;
    }

    // Question mark detection for questions
    if (text.includes('?')) {
      scores.question += 2;
    }

    // Return category with highest score
    const maxCategory = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
    
    return scores[maxCategory] > 0 ? maxCategory : 'other';
  }

  static detectPriority(message, category) {
    const text = message.toLowerCase();
    let priorityScore = 0;

    // Urgent keywords
    if (priorityKeywords.urgent.some(keyword => text.includes(keyword))) {
      priorityScore += 3;
    }

    // High priority keywords
    if (priorityKeywords.high.some(keyword => text.includes(keyword))) {
      priorityScore += 2;
    }

    // Complaints are usually higher priority
    if (category === 'complaint') {
      priorityScore += 2;
    }

    // Exclamation marks and caps might indicate urgency
    if ((text.match(/!/g) || []).length > 2) {
      priorityScore += 1;
    }

    if (text.toUpperCase() === text && text.length > 10) {
      priorityScore += 1;
    }

    // Determine priority level
    if (priorityScore >= 3) return 'urgent';
    if (priorityScore >= 2) return 'high';
    if (priorityScore >= 1) return 'medium';
    return 'low';
  }

  static extractTags(message) {
    const tokens = tokenizer.tokenize(message.toLowerCase());
    const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by']);
    
    return tokens
      .filter(token => token.length > 3 && !commonWords.has(token))
      .slice(0, 5); // Return max 5 tags
  }
}