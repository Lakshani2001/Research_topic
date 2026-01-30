// --- Database of Subjects & Keywords (Rule-Based Source) ---
const educationDB = {
    "Computer Science": {
        topics: ["Machine Learning", "Cloud Computing", "Cybersecurity", "Blockchain Technology", "Internet of Things (IoT)", "Artificial Intelligence", "Big Data Analytics", "Computer Vision", "Software Defined Networks"],
        keywords: ["algorithms", "scalability", "security protocols", "data privacy", "automation", "infrastructure", "neural networks"]
    },
    "Software Engineering": {
        topics: ["Agile Methodologies", "DevOps Practices", "Software Quality Assurance", "Microservices Architecture", "Mobile App Development", "User Experience (UX) Design", "Requirement Engineering", "legacy system migration"],
        keywords: ["SDLC", "testing frameworks", "project management", "deployment pipelines", "user satisfaction", "code maintainability"]
    },
    "Business Management": {
        topics: ["Digital Marketing Strategies", "Consumer Behavior", "Supply Chain Management", "Human Resource Allocation", "Leadership Styles", "E-commerce Adoption", "Corporate Social Responsibility", "Financial Risk Management"],
        keywords: ["customer retention", "ROI", "organizational culture", "employee productivity", "market segmentation", "brand loyalty"]
    },
    "Information Technology": {
        topics: ["E-Governance Systems", "IT Infrastructure", "Information Security Policies", "Digital Transformation", "Smart City Technologies", "Enterprise Resource Planning", "Data Warehousing"],
        keywords: ["IT capability", "accessibility", "user adoption", "system integration", "digital literacy", "process optimization"]
    },
    "Education": {
        topics: ["E-Learning Platforms", "Blended Learning", "Inclusive Education", "STEM Education", "Curriculum Development", "Student Assessment Methods", "Early Childhood Education", "Teacher Training"],
        keywords: ["pedagogy", "student engagement", "learning outcomes", "accessibility", "virtual classrooms", "adaptive learning"]
    }
};

// --- Templates for Topic Generation ---
const templates = {
    diploma: [
        "A Study on the {topic} in {context}",
        "Challenges in Implementing {topic} for {group}",
        "The Impact of {topic} on {group}",
        "Benefits of Using {topic} in {context}",
        "An Overview of {topic} Applications"
    ],
    undergraduate: [
        "Analyzing the Effectiveness of {topic} in {context}",
        "The Role of {topic} on Improving {group} Performance",
        "A Comparative Study of {topic} and its Alternatives",
        "Investigating the Adoption of {topic} among {group}",
        "Design and Implementation of a {topic} based System for {context}"
    ],
    postgraduate: [
        "A Critical Analysis of {topic} on {variable} in {context}",
        "Strategic Implementation of {topic} for Sustainable {variable}",
        "The Correlation between {topic} and {variable} among {group}",
        "Enhancing {variable} through Advanced {topic}: A Case Study of {context}",
        "Modeling the Influence of {topic} on {variable} in the Era of {trend}"
    ],
    phd: [
        "A Novel Framework for Integrating {topic} into {context} for {variable} Optimization",
        "Longitudinal Effects of {topic} on {variable} within {context} Ecosystems",
        "Developing a Predictive Model for {topic} Trends in {context}",
        "Ethical and Societal Implications of {topic} on {variable}: A Multi-dimensional Perspective"
    ]
};

// --- Contexts & Groups ---
const contexts = {
    generic: ["Modern Enterprises", "Educational Institutions", "Small and Medium Enterprises", "the Public Sector", "Healthcare Systems", "Developing Economies"],
    sriLanka: ["Sri Lankan Universities", "the Sri Lankan Apparel Industry", "Rural Communities in Sri Lanka", "the Colombo Stock Exchange", "Sri Lankan Government Schools", "Sri Lankan SME Sector"]
};

const groups = {
    generic: ["Undergraduate Students", "Remote Workers", "Consumers", "IT Professionals", "Managers", "Policy Makers"],
    sriLanka: ["Undergraduates in State Universities", "Sri Lankan Consumers", "Local Farmers", "Public Sector Employees in Sri Lanka"]
};

const trends = ["Industry 4.0", "Digitalization", "Globalization", "Remote Work", "Climate Change"];
const variables = ["Operational Efficiency", "Decision Making", "User Satisfaction", "Economic Growth", "Innovation", "Security"];

// --- DOM Elements ---
const subjectSelect = document.getElementById('subject');
const levelSelect = document.getElementById('level');
const slContextCheck = document.getElementById('sri-lanka-context');
const difficultyToggle = document.getElementById('difficulty-toggle');
const generateBtn = document.getElementById('generate-btn');
const resultsArea = document.getElementById('results-area');
const topicsList = document.getElementById('topics-list');
const objectivesList = document.getElementById('objectives-list');
const keywordsContainer = document.getElementById('keywords-container');

// --- Initialization ---
function init() {
    // Populate Subject Dropdown
    Object.keys(educationDB).forEach(subject => {
        const option = document.createElement('option');
        option.value = subject;
        option.textContent = subject;
        subjectSelect.appendChild(option);
    });

    generateBtn.addEventListener('click', generateResearch);
    
    // Copy All Button
    document.getElementById('copy-all-btn').addEventListener('click', () => {
        const text = topicsList.innerText;
        navigator.clipboard.writeText(text).then(() => alert("All topics copied to clipboard!"));
    });

    // Regenerate Button
    document.getElementById('regenerate-btn').addEventListener('click', generateResearch);
}

// --- Core Generator Logic ---
function generateResearch() {
    const subject = subjectSelect.value;
    const level = levelSelect.value;
    const isSL = slContextCheck.checked;
    const isAdvanced = difficultyToggle.checked;

    if (!subject) {
        alert("Please select a subject first!");
        return;
    }

    // scroll to results
    resultsArea.classList.remove('hidden');
    resultsArea.scrollIntoView({ behavior: 'smooth' });

    // 1. Generate Topics
    generateTopics(subject, level, isSL, isAdvanced);

    // 2. Generate Objectives
    generateObjectives(subject);

    // 3. Generate Keywords
    generateKeywords(subject);
}

function generateTopics(subject, level, isSL, isAdvanced) {
    topicsList.innerHTML = '';
    
    const subjectData = educationDB[subject];
    // Use selected level or bump up if 'Advanced' is checked
    let patternKey = level;
    if (isAdvanced && level === 'undergraduate') patternKey = 'postgraduate';
    if (isAdvanced && level === 'postgraduate') patternKey = 'phd';

    const selectedPatterns = templates[patternKey] || templates['undergraduate'];
    const usedPatterns = getRandomSubset(selectedPatterns, 5); // Pick 5 random patterns

    usedPatterns.forEach(pattern => {
        const topicVal = getRandomItem(subjectData.topics);
        const contextVal = isSL ? getRandomItem(contexts.sriLanka) : getRandomItem(contexts.generic);
        const groupVal = isSL ? getRandomItem(groups.sriLanka) : getRandomItem(groups.generic);
        const variableVal = getRandomItem(variables);
        const trendVal = getRandomItem(trends);

        let finalTopic = pattern
            .replace('{topic}', topicVal)
            .replace('{context}', contextVal)
            .replace('{group}', groupVal)
            .replace('{variable}', variableVal)
            .replace('{trend}', trendVal);

        // Highlight Keywords logic could go here, but keeping it simple for now
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${finalTopic}</span>
            <i class="fa-regular fa-copy copy-icon" title="Copy" onclick="copyText('${finalTopic}')"></i>
        `;
        topicsList.appendChild(li);
    });
}

function generateObjectives(subject) {
    objectivesList.innerHTML = '';
    const bases = [
        "To identify the current state of {topic} adoption.",
        "To analyze the key factors influencing {topic} success.",
        "To evaluate the challenges associated with implementing {topic}.",
        "To propose a framework for improving efficiency using {topic}.",
        "To examine the relationship between {topic} and performance."
    ];
    
    // Pick 3 random objectives
    getRandomSubset(bases, 3).forEach(base => {
        const topicVal = getRandomItem(educationDB[subject].topics);
        const li = document.createElement('li');
        li.textContent = base.replace('{topic}', topicVal.toLowerCase());
        objectivesList.appendChild(li);
    });
}

function generateKeywords(subject) {
    keywordsContainer.innerHTML = '';
    const subjectKeywords = educationDB[subject].keywords;
    const randomKeywords = getRandomSubset(subjectKeywords, 5);

    randomKeywords.forEach(kw => {
        const span = document.createElement('span');
        span.className = 'tag';
        span.textContent = kw;
        keywordsContainer.appendChild(span);
    });
}

// --- Utility Functions ---
function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomSubset(arr, size) {
    const shuffled = arr.slice().sort(() => 0.5 - Math.random());
    return shuffled.slice(0, size);
}

// Global scope for HTML onclick
window.copyText = function(text) {
    navigator.clipboard.writeText(text);
    // Could add a toast notification here
};

// Run
document.addEventListener('DOMContentLoaded', init);
