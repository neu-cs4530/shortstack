export const Q1_DESC = 'Programmatically navigate using React router';
export const Q1_TXT =
  'the alert shows the proper index for the li clicked, and when I alert the variable within the last function Im calling, moveToNextImage(stepClicked), the same value shows but the animation isnt happening. This works many other ways, but Im trying to pass the index value of the list item clicked to use for the math to calculate.';

export const Q2_DESC =
  'android studio save string shared preference, start activity and load the saved string';
export const Q2_TXT =
  'I am using bottom navigation view but am using custom navigation, so my fragments are not recreated every time i switch to a different view. I just hide/show my fragments depending on the icon selected. The problem i am facing is that whenever a config change happens (dark/light theme), my app crashes. I have 2 fragments in this activity and the below code is what i am using to refrain them from being recreated.';

export const Q3_DESC = 'Object storage for a web application';
export const Q3_TXT =
  'I am currently working on a website where, roughly 40 million documents and images should be served to its users. I need suggestions on which method is the most suitable for storing content with subject to these requirements.';

export const Q4_DESC = 'Quick question about storage on android';
export const Q4_TXT =
  'I would like to know the best way to go about storing an array on an android phone so that even when the app/activity ended the data remains';

export const A1_TXT =
  "React Router is mostly a wrapper around the history library. history handles interaction with the browser's window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don't have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.";
export const A2_TXT =
  "On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn't change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router.";
export const A3_TXT =
  'Consider using apply() instead; commit writes its data to persistent storage immediately, whereas apply will handle it in the background.';
export const A4_TXT =
  'YourPreference yourPrefrence = YourPreference.getInstance(context); yourPreference.saveData(YOUR_KEY,YOUR_VALUE);';
export const A5_TXT = 'I just found all the above examples just too confusing, so I wrote my own.';
export const A6_TXT = 'Storing content as BLOBs in databases.';
export const A7_TXT = 'Using GridFS to chunk and store content.';
export const A8_TXT = 'Store data in a SQLLite database.';

export const T1_NAME = 'react';
export const T1_DESC =
  'React is a JavaScript-based UI development library. Although React is a library rather than a language, it is widely used in web development. The library first appeared in May 2013 and is now one of the most commonly used frontend libraries for web development.';

export const T2_NAME = 'javascript';
export const T2_DESC =
  'JavaScript is a versatile programming language primarily used in web development to create interactive effects within web browsers. It was initially developed by Netscape as a means to add dynamic and interactive elements to websites.';

export const T3_NAME = 'android-studio';
export const T3_DESC =
  "Android Studio is the official Integrated Development Environment (IDE) for Google's Android operating system. It is built on JetBrains' IntelliJ IDEA software and is specifically designed for Android development.";

export const T4_NAME = 'shared-preferences';
export const T4_DESC =
  'SharedPreferences is an Android API that allows for simple data storage in the form of key-value pairs. It is commonly used for storing user settings, configuration, and other small pieces of data.';

export const T5_NAME = 'storage';
export const T5_DESC =
  'Storage refers to the various methods and technologies used to store digital data. This can include local storage, cloud storage, databases, file systems, and more, depending on the context.';

export const T6_NAME = 'website';
export const T6_DESC =
  'A website is a collection of interlinked web pages, typically identified with a common domain name, and published on at least one web server. Websites can serve various purposes, such as information sharing, entertainment, commerce, and social networking.';

export const C1_TEXT =
  'This explanation about React Router is really helpful! I never realized it was just a wrapper around history. Thanks!';
export const C2_TEXT =
  'I appreciate the detailed breakdown of how to use a single history object in React. It simplified my routing significantly.';
export const C3_TEXT =
  "Thank you for the suggestion on using apply() instead of commit. My app's performance has improved!";
export const C4_TEXT =
  'Your code snippet for saving data with YourPreference worked like a charm! I was struggling with SharedPreferences before.';
export const C5_TEXT =
  'I get what you mean by those examples being confusing. Your custom approach makes way more sense for my use case.';
export const C6_TEXT =
  "I hadn't considered using BLOBs for storing content in a database. This will work perfectly for my needs.";
export const C7_TEXT =
  "GridFS seems like a good option for chunking large files. I'll give it a try for my media storage requirements.";
export const C8_TEXT =
  'SQLLite is such a versatile solution for local storage, especially for mobile applications. Thanks for the reminder!';
export const C9_TEXT =
  'The question about React Router really resonates with me, I faced the same challenge a few weeks ago.';
export const C10_TEXT =
  "The answer recommending GridFS was eye-opening. I've used it before but never thought of applying it in this scenario!";
export const C11_TEXT =
  'I found the discussion on SharedPreferences vs apply() very useful. Great explanation of the differences!';
export const C12_TEXT =
  "I feel like there's so much more to Android Studio that I'm just scratching the surface of. Thanks for sharing your experience!";

export const P1_TITLE = 'Which operating system do you prefer for development?';
export const P2_TITLE = 'Preferred Programming Language';
export const P3_TITLE = 'Do you prefer static typing or dynamic typing in programming languages?';

export const ART1_TITLE = 'The Future of Quantum Computing: What You Need to Know';
export const ART1_BODY =
  'Quantum computing is one of the most exciting and controversial areas of technology development. At its core, quantum computing leverages the principles of quantum mechanics to process information in ways that traditional classical computers simply cannot. Unlike classical bits, which can only represent 0 or 1, quantum bits or qubits can represent multiple states simultaneously, thanks to superposition and entanglement. This gives quantum computers the potential to solve certain problems exponentially faster than classical computers.\n\nCurrently, quantum computers are still in their infancy, but they promise to revolutionize fields such as cryptography, optimization, and material science. One of the most well-known potential applications is in the field of cryptography. Quantum computers have the ability to break current encryption methods, leading to the development of new, quantum-resistant encryption standards.\n\nThe race to build practical quantum computers is underway, with companies like IBM, Google, and Intel making significant investments. However, there are still many technical hurdles to overcome, including issues with qubit coherence times and error rates. Despite these challenges, the future of quantum computing holds great promise, with breakthroughs expected in the next decade. As researchers continue to advance quantum algorithms and hardware, we may see quantum computers take on real-world problems that are currently out of reach for classical machines.';

export const ART2_TITLE = 'Why Python is the Go-To Language in 2024';
export const ART2_BODY =
  'Python is everywhere in 2024, and for good reason. It’s easy to learn, with a simple, readable syntax that’s perfect for beginners. But don’t let that fool you—Python is also packed with powerful libraries for everything from web development (think Flask and Django) to data science (Pandas, NumPy).\n\nThe best part? You can do almost anything with it—automate tasks, build websites, even create games. Python’s versatility and huge community make it a must-learn language for anyone in tech.\n\nIf you haven’t tried it yet, now’s a great time!';

export const ART3_TITLE = 'Lorem Ipsum: Dolor Sit Amet Consectetur Adipiscing Elit';
export const ART3_BODY =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla.';

export const ART4_TITLE = 'The Rise of Edge Computing: Transforming IoT and Beyond';
export const ART4_BODY =
  'In recent years, edge computing has emerged as a game-changing technology for the Internet of Things (IoT) and distributed systems. Unlike traditional cloud computing, edge computing processes data closer to where it’s generated, reducing latency and improving real-time decision-making. This approach is particularly beneficial for applications such as autonomous vehicles, smart cities, and industrial IoT, where milliseconds can make a difference. By decentralizing computation, edge computing not only enhances performance but also alleviates bandwidth stress on centralized data centers. The adoption of edge computing is growing rapidly, fueled by advancements in 5G and AI. Major tech companies are investing heavily in edge infrastructure, with frameworks like AWS Greengrass and Microsoft Azure IoT Edge leading the charge. However, challenges remain, including concerns around security, scalability, and the integration of edge and cloud environments. As the tech community continues to innovate, the future of edge computing looks promising, offering a robust foundation for the next generation of connected devices.';

export const ART5_TITLE = 'Mastering Rust: Why Developers Are Turning to This Memory-Safe Language';
export const ART5_BODY =
  'Rust has quickly gained a reputation as one of the most loved programming languages among developers, according to Stack Overflow surveys. Known for its focus on memory safety without sacrificing performance, Rust addresses long-standing issues such as buffer overflows and null pointer dereferences. Its ownership model enforces compile-time checks that catch bugs before they become runtime errors, making it a top choice for systems programming, web assembly, and blockchain development. Beyond its technical merits, Rust boasts an active and supportive community that champions open-source collaboration. Tools like Cargo, its package manager, simplify dependency management and streamline project workflows. Companies like Mozilla, Discord, and Dropbox have adopted Rust for performance-critical applications, highlighting its versatility. As more developers embrace Rust, its ecosystem continues to expand, making it a language worth exploring for anyone passionate about clean, efficient, and reliable code.';

export const CHAL1_DESCRIPTION = 'Answer 1 question';
export const CHAL1_AMT = 1;
export const CHAL1_REWARD = 'Rookie Responder';

export const CHAL2_DESCRIPTION = 'Answer 10 questions';
export const CHAL2_AMT = 10;
export const CHAL2_REWARD = 'Star Contributor';

export const CHAL3_DESCRIPTION = 'Ask 1 question';
export const CHAL3_AMT = 1;
export const CHAL3_REWARD = 'Curious Explorer';

export const CHAL4_DESCRIPTION = 'Ask 5 questions';
export const CHAL4_AMT = 5;
export const CHAL4_REWARD = 'Engaged Inquirer';

export const CHAL5_DESCRIPTION = 'Answer 10 questions in a single day';
export const CHAL5_AMT = 10;
export const CHAL5_REWARD = 'Unstoppable';
export const CHAL5_HRS = 24;

export const CHAL6_DESCRIPTION = 'Receive 25 upvotes';
export const CHAL6_AMT = 25;
export const CHAL6_REWARD = 'Popular';
