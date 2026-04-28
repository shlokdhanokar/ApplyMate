const { app } = require('electron');
const fs = require('fs');
const path = require('path');

class Store {
  constructor() {
    const userDataPath = app.getPath('userData');
    this.filePath = path.join(userDataPath, 'applymate-data.json');
    this.data = this._loadOrInit();
  }

  _getDefaultData() {
    return {
      links: [
        { id: this._id(), label: 'Portfolio', url: 'https://yourportfolio.com', icon: '🌐' },
        { id: this._id(), label: 'GitHub', url: 'https://github.com/yourusername', icon: '🐙' },
        { id: this._id(), label: 'LinkedIn', url: 'https://linkedin.com/in/yourusername', icon: '💼' },
        { id: this._id(), label: 'Resume', url: 'https://drive.google.com/your-resume-link', icon: '📄' },
        { id: this._id(), label: 'LeetCode', url: 'https://leetcode.com/u/yourusername/', icon: '🧩' },
        { id: this._id(), label: 'Twitter / X', url: 'https://x.com/yourusername', icon: '𝕏' },
      ],
      answers: [
        {
          id: this._id(),
          title: 'Tell me about yourself',
          text: `I'm a passionate Software Engineer currently pursuing my studies in Computer Science. I have a strong foundation in backend development and machine learning. I've built multiple projects ranging from web applications to AI tools. I'm driven by a deep curiosity for how intelligent systems can solve real-world problems.`,
          tags: ['General', 'HR'],
          pinned: true
        },
        {
          id: this._id(),
          title: 'Why should you be hired?',
          text: `You should hire me because I bring a unique combination of technical expertise, project experience, and a genuine passion for building impactful solutions. I am a fast learner who thrives in collaborative environments, and I consistently go beyond the minimum requirements to deliver results with quality and attention to detail.`,
          tags: ['HR', 'General'],
          pinned: true
        },
        {
          id: this._id(),
          title: 'Why are you interested in this role?',
          text: `I'm interested in this role because it aligns perfectly with my skills and gives me the opportunity to work on challenging, real-world problems. I admire the company's commitment to innovation and believe my experience building scalable projects would allow me to contribute meaningfully from day one.`,
          tags: ['HR', 'General'],
          pinned: true
        },
        {
          id: this._id(),
          title: 'Describe your experience',
          text: `I have hands-on experience across backend development and full-stack web development. My key projects include building automated agents, real-time data pipelines, and responsive web dashboards. I am comfortable with Python, JavaScript/TypeScript, React, Node.js, and various cloud deployment tools.`,
          tags: ['General', 'Backend'],
          pinned: false
        },
        {
          id: this._id(),
          title: 'Strengths and Weaknesses',
          text: `Strengths:\n• Strong problem-solving skills\n• Ability to quickly learn and apply new technologies\n• End-to-end project delivery\n\nWeaknesses:\n• I sometimes spend extra time perfecting details when a "good enough" solution would suffice — I'm learning to balance perfectionism with pragmatism.`,
          tags: ['HR', 'General'],
          pinned: false
        },
        {
          id: this._id(),
          title: 'Project Explanation (Short)',
          text: `One of my key projects is an AI-powered automation agent that categorizes incoming data and triggers workflows. It uses modern NLP techniques for classification and a React dashboard for monitoring. This project demonstrates my ability to combine backend engineering and frontend design into a cohesive tool.`,
          tags: ['Tech', 'Projects'],
          pinned: true
        }
      ],
      copyHistory: [],
      settings: {
        theme: 'dark',
        alwaysOnTop: false
      }
    };
  }

  _id() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
  }

  _loadOrInit() {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.error('Error loading data, using defaults:', err);
    }
    const defaults = this._getDefaultData();
    this._write(defaults);
    return defaults;
  }

  _write(data) {
    try {
      const dir = path.dirname(this.filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error writing data:', err);
    }
  }

  getData() {
    return this.data;
  }

  saveData(newData) {
    this.data = newData;
    this._write(this.data);
    return true;
  }

  getFilePath() {
    return this.filePath;
  }
}

module.exports = Store;
