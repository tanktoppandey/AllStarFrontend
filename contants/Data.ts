// types.ts
export interface PostPage {
  id: string;
  type: 'normal' | 'poll' | 'mcq';
  image: string;
  description?: string;
  question?: string;
  options?: { 
    id: string; 
    text: string; 
    votes?: number;
  }[];
  correctAnswer?: string;
}

export interface Post {
  id: string;
  headline: string;
  category: string;
  pages: PostPage[];
}

// data.ts
export const posts: Post[] = [
  {
    id: 'post_001',
    headline: 'Breaking: Major Transfer News Revealed',
    category: 'Transfers',
    pages: [
      {
        id: 'page_001_1',
        type: 'normal',
        image: 'https://picsum.photos/800/1200?random=1',
        description: "Several Premier League clubs are preparing significant bids for key targets, with strikers being a priority. Manchester United and Arsenal are at the forefront of these negotiations."
      },
      {
        id: 'page_001_2',
        type: 'poll',
        image: 'https://picsum.photos/800/1200?random=2',
        question: "Who is the best striker currently?",
        options: [
          { id: 'opt_001_1', text: 'Erling Haaland', votes: 45 },
          { id: 'opt_001_2', text: 'Kylian Mbappe', votes: 35 },
          { id: 'opt_001_3', text: 'Harry Kane', votes: 20 }
        ]
      }
    ]
  },
  {
    id: 'post_002',
    headline: 'Champions League Quarter-Finals Draw',
    category: 'Champions League',
    pages: [
      {
        id: 'page_002_1',
        type: 'normal',
        image: 'https://picsum.photos/800/1200?random=3',
        description: "The Champions League draw has produced some fascinating matchups, with several heavyweight clashes set to take place in the quarter-finals."
      },
      {
        id: 'page_002_2',
        type: 'mcq',
        image: 'https://picsum.photos/800/1200?random=4',
        question: "Which team has won the most Champions League titles?",
        options: [
          { id: 'opt_002_1', text: 'Real Madrid' },
          { id: 'opt_002_2', text: 'AC Milan' }
        ],
        correctAnswer: 'opt_002_1'
      }
    ]
  },
  {
    id: 'post_003',
    headline: 'Premier League Title Race Update',
    category: 'Premier League',
    pages: [
      {
        id: 'page_003_1',
        type: 'normal',
        image: 'https://picsum.photos/800/1200?random=5',
        description: "The Premier League title race is heating up with just five points separating the top three teams. Each match is becoming increasingly crucial as the season progresses."
      },
      {
        id: 'page_003_2',
        type: 'poll',
        image: 'https://picsum.photos/800/1200?random=6',
        question: "Who will win the Premier League?",
        options: [
          { id: 'opt_003_1', text: 'Manchester City', votes: 40 },
          { id: 'opt_003_2', text: 'Arsenal', votes: 35 },
          { id: 'opt_003_3', text: 'Liverpool', votes: 25 }
        ]
      }
    ]
  },
  {
    id: 'post_004',
    headline: 'Serie A Latest: Milan Derby Impact on Title Race',
    category: 'Serie A',
    pages: [
      {
        id: 'page_004_1',
        type: 'normal',
        image: 'https://picsum.photos/800/1200?random=7',
        description: "The Milan derby has significantly impacted the Serie A title race, with both teams showing exceptional quality in a high-stakes match."
      },
      {
        id: 'page_004_2',
        type: 'mcq',
        image: 'https://picsum.photos/800/1200?random=8',
        question: "Which Milan team has won more Serie A titles?",
        options: [
          { id: 'opt_004_1', text: 'AC Milan' },
          { id: 'opt_004_2', text: 'Inter Milan' }
        ],
        correctAnswer: 'opt_004_1'
      }
    ]
  },
  {
    id: 'post_005',
    headline: 'La Liga: Barcelona vs Real Madrid Preview',
    category: 'La Liga',
    pages: [
      {
        id: 'page_005_1',
        type: 'normal',
        image: 'https://picsum.photos/800/1200?random=9',
        description: "El Clásico approaches with both teams in excellent form. The match could be decisive for the La Liga title race."
      },
      {
        id: 'page_005_2',
        type: 'poll',
        image: 'https://picsum.photos/800/1200?random=10',
        question: "Who will win El Clásico?",
        options: [
          { id: 'opt_005_1', text: 'Real Madrid', votes: 38 },
          { id: 'opt_005_2', text: 'Barcelona', votes: 42 },
          { id: 'opt_005_3', text: 'Draw', votes: 20 }
        ]
      }
    ]
  },
  {
    id: 'post_006',
    headline: 'Bundesliga Rising Stars',
    category: 'Bundesliga',
    pages: [
      {
        id: 'page_006_1',
        type: 'normal',
        image: 'https://picsum.photos/800/1200?random=11',
        description: "The Bundesliga continues to produce exceptional young talent, with several players catching the eye of major European clubs."
      },
      {
        id: 'page_006_2',
        type: 'mcq',
        image: 'https://picsum.photos/800/1200?random=12',
        question: "Which club has produced the most Bundesliga players under 21 this season?",
        options: [
          { id: 'opt_006_1', text: 'Borussia Dortmund' },
          { id: 'opt_006_2', text: 'RB Leipzig' }
        ],
        correctAnswer: 'opt_006_1'
      }
    ]
  }
];