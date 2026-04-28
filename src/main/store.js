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
        { id: this._id(), label: 'Portfolio', url: 'https://shlokdhanokar.vercel.app', icon: '🌐' },
        { id: this._id(), label: 'GitHub', url: 'https://github.com/shlokdhanokar', icon: '🐙' },
        { id: this._id(), label: 'LinkedIn', url: 'https://www.linkedin.com/in/shlokdhanokar', icon: '💼' },
        { id: this._id(), label: 'Resume (Drive)', url: 'https://drive.google.com/file/d/1hVbT-mfF9mMWIUEmmUlfzg73wTlSdUGX/view?usp=sharing', icon: '📄' },
        { id: this._id(), label: 'Resume (GitHub)', url: 'https://github.com/shlokdhanokar/RESUME/blob/main/SHLOK%20RESUME.pdf', icon: '📄' },
        { id: this._id(), label: 'LeetCode', url: 'https://leetcode.com/u/shlok_dhanokar/', icon: '🧩' },
        { id: this._id(), label: 'CodeChef', url: 'https://www.codechef.com/users/shlok_dhanokar', icon: '👨‍🍳' },
        { id: this._id(), label: 'Instagram', url: 'https://www.instagram.com/_shlok.exe/', icon: '📸' },
        { id: this._id(), label: 'X (Twitter)', url: 'https://x.com/_shlowkey', icon: '𝕏' },
      ],
      answers: [
        {
          id: this._id(),
          title: 'Tell me about yourself',
          text: `I'm Shlok Dhanokar, a passionate AI/ML Engineer and Backend Developer currently pursuing my studies in Computer Science. I have a strong foundation in Python, machine learning, deep learning, and full-stack web development. I've built multiple projects ranging from emotion detection systems and driver drowsiness detection to full-stack portfolio websites and AI-powered automation tools. I'm driven by a deep curiosity for how intelligent systems can solve real-world problems, and I actively participate in competitive programming on platforms like LeetCode and CodeChef to sharpen my problem-solving skills.`,
          tags: ['General', 'HR'],
          pinned: true
        },
        {
          id: this._id(),
          title: 'Why should you be hired?',
          text: `You should hire me because I bring a unique combination of technical expertise, project experience, and a genuine passion for building impactful solutions. I don't just write code — I understand the "why" behind every project. My portfolio demonstrates end-to-end delivery: from ideation and architecture to deployment. I'm a fast learner who thrives in collaborative environments, and I consistently go beyond the minimum requirements. Whether it's building an AI agent, optimizing a backend pipeline, or designing a modern UI, I deliver results with quality and attention to detail.`,
          tags: ['HR', 'General'],
          pinned: true
        },
        {
          id: this._id(),
          title: 'Why are you interested in this role?',
          text: `I'm interested in this role because it aligns perfectly with my skills in [AI/ML / Backend Development / Full-Stack Development] and gives me the opportunity to work on challenging, real-world problems at scale. I admire [Company]'s commitment to innovation and believe that my experience building projects like intelligent automation agents and ML-powered applications would allow me to contribute meaningfully from day one. I'm excited about the chance to learn from talented engineers while making a tangible impact.`,
          tags: ['HR', 'General'],
          pinned: true
        },
        {
          id: this._id(),
          title: 'Describe your experience',
          text: `I have hands-on experience across AI/ML, backend development, and full-stack web development. My key projects include:\n\n• MAILFLOW — An intelligent email classification and automation agent using BERT and LangChain\n• Driver Drowsiness Detection — A real-time computer vision system using OpenCV and deep learning\n• Emotion Detection — A facial emotion recognition system with CNN-based classification\n• Portfolio Website — A premium React + TypeScript portfolio with 3D effects and smooth animations\n• Voice AI Agent — A voice-controlled local AI assistant with intent classification and tool execution\n\nI've also actively competed on LeetCode and CodeChef, which has strengthened my DSA and algorithmic thinking. I'm comfortable with Python, JavaScript/TypeScript, React, Node.js, TensorFlow, PyTorch, and various cloud tools.`,
          tags: ['General', 'Backend', 'AI'],
          pinned: false
        },
        {
          id: this._id(),
          title: 'Strengths and Weaknesses',
          text: `Strengths:\n• Strong problem-solving skills backed by competitive programming\n• Ability to quickly learn and apply new technologies\n• End-to-end project delivery — from concept to deployment\n• Clean code practices and attention to UI/UX detail\n• Self-motivated with a strong work ethic\n\nWeaknesses:\n• I sometimes spend extra time perfecting details when a "good enough" solution would suffice — I'm learning to balance perfectionism with pragmatism\n• I'm working on improving my public speaking and presentation skills by actively seeking opportunities to present my work`,
          tags: ['HR', 'General'],
          pinned: false
        },
        {
          id: this._id(),
          title: 'Project Explanation (Short)',
          text: `One of my key projects is MAILFLOW — an AI-powered email agent that automatically classifies incoming emails using a fine-tuned BERT model and takes intelligent actions like drafting replies, scheduling follow-ups, or flagging urgent messages. It uses LangGraph for multi-step agentic workflows and has a modern React dashboard for monitoring. The project demonstrates my ability to combine NLP, backend engineering, and frontend design into a cohesive, production-ready tool.`,
          tags: ['AI', 'Backend'],
          pinned: true
        },
        {
          id: this._id(),
          title: 'Project Explanation (Detailed)',
          text: `MAILFLOW — Intelligent Email Classification & Automation Agent\n\nProblem: Professionals waste hours daily managing emails manually — reading, categorizing, and responding to repetitive messages.\n\nSolution: I built an end-to-end AI-powered email agent that:\n1. Connects to Gmail via API and fetches emails in real-time\n2. Classifies each email using a fine-tuned BERT transformer model into categories (Urgent, Meeting, Newsletter, Spam, etc.)\n3. Uses LangGraph to orchestrate multi-step agentic workflows — deciding whether to auto-reply, schedule a follow-up, or escalate\n4. Provides a React-based dashboard with real-time analytics, classification history, and manual override controls\n\nTech Stack: Python, PyTorch, HuggingFace Transformers, LangChain, LangGraph, FastAPI, React, TypeScript\n\nKey Achievements:\n• Achieved 94% classification accuracy on a custom dataset\n• Reduced email processing time by ~70% in simulated workloads\n• Designed a modular plugin architecture for easy extension\n\nThis project showcases my skills in NLP, agentic AI, backend architecture, and modern frontend development.`,
          tags: ['AI', 'Backend'],
          pinned: false
        },
        {
          id: this._id(),
          title: 'Where do you see yourself in 5 years?',
          text: `In 5 years, I see myself as a senior engineer or technical lead working at the intersection of AI and software engineering. I want to be building intelligent systems that have real-world impact — whether that's in healthcare, productivity tools, or developer infrastructure. I plan to deepen my expertise in machine learning engineering and system design while mentoring junior developers. Ultimately, I want to be someone who bridges the gap between cutting-edge AI research and practical, scalable products.`,
          tags: ['HR', 'General'],
          pinned: false
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
