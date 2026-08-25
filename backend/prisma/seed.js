require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");
const connectionString = process.env.DATABASE_URL;


// Create the pool
const pool = new Pool({ connectionString });
// Create the adapter
const adapter = new PrismaPg(pool);
// Pass the adapter to the PrismaClient constructor
const prisma = new PrismaClient({ adapter });


const tags = [
{ name: "React", slug: "react", description: "Frontend Library" },
{ name: "Next.js", slug: "nextjs", description: "React Framework" },
{ name: "Node.js", slug: "nodejs", description: "JavaScript Runtime" },
{ name: "Express", slug: "express", description: "Backend Framework" },
{ name: "TypeScript", slug: "typescript", description: "Typed JavaScript" },
{ name: "JavaScript", slug: "javascript", description: "Programming Language" },
{ name: "Python", slug: "python", description: "Programming Language" },
{ name: "Java", slug: "java", description: "Programming Language" },
{ name: "C++", slug: "cpp", description: "Programming Language" },
{ name: "Rust", slug: "rust", description: "Systems Programming" },
{ name: "Go", slug: "go", description: "Programming Language" },
{ name: "PostgreSQL", slug: "postgresql", description: "Relational Database" },
{ name: "MongoDB", slug: "mongodb", description: "NoSQL Database" },
{ name: "Redis", slug: "redis", description: "Caching Database" },
{ name: "Docker", slug: "docker", description: "Containerization" },
{ name: "Kubernetes", slug: "kubernetes", description: "Container Orchestration" },
{ name: "Prisma", slug: "prisma", description: "ORM" },
{ name: "Firebase", slug: "firebase", description: "Backend Platform" },
{ name: "Tailwind CSS", slug: "tailwindcss", description: "CSS Framework" },
{ name: "Linux", slug: "linux", description: "Operating System" },
{ name: "Machine Learning", slug: "machine-learning", description: "Artificial Intelligence" },
{ name: "Artificial Intelligence", slug: "ai", description: "AI Concepts" },
{ name: "Arduino", slug: "arduino", description: "Microcontroller Platform" },
{ name: "ESP32", slug: "esp32", description: "WiFi Microcontroller" },
{ name: "STM32", slug: "stm32", description: "ARM Microcontroller" },
{ name: "Embedded Systems", slug: "embedded-systems", description: "Embedded Programming" },
{ name: "PCB Design", slug: "pcb-design", description: "Circuit Board Design" },
{ name: "Electronics", slug: "electronics", description: "Hardware Engineering" },
{ name: "Drone", slug: "drone", description: "Quadcopters and UAVs" },
{ name: "Robotics", slug: "robotics", description: "Automation and Robotics" }
];

// just so tag is not in tag list
function getTagId(tags, tagName) {
    const tag = tags.find(t => t.name === tagName);

    if (!tag) {
        throw new Error(`Tag ${tagName} not found`);
    }

    return tag.id;
}

// for generating random numbers with some interval
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const postLibrary = [

{
title:"Understanding React Context API",
content:"A beginner friendly guide explaining how Context API removes prop drilling and simplifies state management.",
tags:["React","JavaScript"],
coverImage:"/avatars/Posts/postpic.jpg",
githubUrl: "https://github.com/Inovate-Ishaan/Tech-Archive"
},

{
title:"Mastering Prisma ORM",
content:"Learn relations, migrations and efficient querying using Prisma ORM.",
tags:["Prisma","PostgreSQL"],
coverImage:"/avatars/Posts/postpic.jpg",
githubUrl: "https://github.com/Inovate-Ishaan/Tech-Archive"
},

{
title:"Building REST APIs with Express",
content:"Design scalable REST APIs using Express and Node.js.",
tags:["Express","Node.js"],
coverImage:"/avatars/Posts/postpic.jpg",
githubUrl: "https://github.com/Inovate-Ishaan/Tech-Archive"
},

{
title:"ESP32 Home Automation",
content:"Control appliances remotely using MQTT and ESP32.",
tags:["ESP32","Embedded Systems","Electronics"],
coverImage:"/avatars/Posts/postpic.jpg",
githubUrl: "https://github.com/Inovate-Ishaan/Tech-Archive"
},

{
title:"Designing PCBs with KiCad",
content:"Complete PCB design workflow from schematic to fabrication.",
tags:["PCB Design","Electronics"],
coverImage:"/avatars/Posts/postpic.jpg",
githubUrl: "https://github.com/Inovate-Ishaan/Tech-Archive"
},

{
title:"Building a PID Controlled Drone",
content:"PID tuning techniques for roll, pitch and yaw stabilization.",
tags:["Drone","STM32","Embedded Systems"],
coverImage:"/avatars/Posts/postpic.jpg",
githubUrl: "https://github.com/Inovate-Ishaan/Tech-Archive"
},

{
title:"Docker for Beginners",
content:"Containerize Node.js applications using Docker.",
tags:["Docker","Linux"],
coverImage:"/avatars/Posts/postpic.jpg",
githubUrl: "https://github.com/Inovate-Ishaan/Tech-Archive"
},

{
title:"Introduction to Kubernetes",
content:"Deploy and scale containerized applications.",
tags:["Kubernetes","Docker"],
coverImage:"/avatars/Posts/postpic.jpg",
githubUrl: "https://github.com/Inovate-Ishaan/Tech-Archive"
},

{
title:"Machine Learning Basics",
content:"Understand supervised learning with Python.",
tags:["Machine Learning","Python"],
coverImage:"/avatars/Posts/postpic.jpg",
githubUrl: "https://github.com/Inovate-Ishaan/Tech-Archive"
},

{
title:"Redis Caching",
content:"Improve backend performance using Redis caching.",
tags:["Redis","Node.js"],
coverImage:"/avatars/Posts/postpic.jpg",
githubUrl: "https://github.com/Inovate-Ishaan/Tech-Archive"
},

{
title:"Tailwind CSS Tips",
content:"Useful utility classes that speed up frontend development.",
tags:["Tailwind CSS","React"],
coverImage:"/avatars/Posts/postpic.jpg",
githubUrl: "https://github.com/Inovate-Ishaan/Tech-Archive"
},

{
title:"Getting Started with PostgreSQL",
content:"Learn tables, joins and indexing using PostgreSQL.",
tags:["PostgreSQL"],
coverImage:"/avatars/Posts/postpic.jpg",
githubUrl: "https://github.com/Inovate-Ishaan/Tech-Archive"
},

{
title:"Arduino Sensor Projects",
content:"Reading sensor data with Arduino boards.",
tags:["Arduino","Electronics"],
coverImage:"/avatars/Posts/postpic.jpg",
githubUrl: "https://github.com/Inovate-Ishaan/Tech-Archive"
},

{
title:"Building Authentication using JWT",
content:"Implement secure login using JSON Web Tokens.",
tags:["Express","Node.js"],
coverImage:"/avatars/Posts/postpic.jpg",
githubUrl: "https://github.com/Inovate-Ishaan/Tech-Archive"
},

{
title:"Linux Command Line Essentials",
content:"Commands every backend developer should know.",
tags:["Linux"],
coverImage:"/avatars/Posts/postpic.jpg",
githubUrl: "https://github.com/Inovate-Ishaan/Tech-Archive"
}

];


async function main() {
  console.log("Starting database seed...");

  // Clear child tables first
  await prisma.bookmark.deleteMany();
  await prisma.postTag.deleteMany();
  await prisma.post.deleteMany();

  // Then parent tables
  await prisma.tags.deleteMany();
  await prisma.user.deleteMany();
  await prisma.otp.deleteMany();

  // creating tags
  console.log("Creating tags...");
  await prisma.tags.createMany({
    data: tags
  });

  // containig hashed password
  const hashed = await bcrypt.hash("password123", 10);

  // Creating Users
  console.log("Creating users...");
  await prisma.user.createMany({
    data: [
  {
  username: "jayavardhan",
  email: "bjayavardh@iitbhilai.ac.in",
  password: hashed,
  displayname: "Jayavardhan",
  avatar: "/avatars/ProfilePics/cat.jpg",
  bio: "Backend & RTL Designer",
  branch: "ECE",
  year: 2029,
  instituteId: "B25EC009",
  github: "https://github.com/UNDEO157K",
  linkedin: "jayvardhan",
  website: null,
  emailVerified: true
  },

  {
  username: "eyeshukla",
  email: "ishukla@iitbhilai.ac.in",
  password: hashed,
  displayname: "Ishaan Shukla",
  avatar: "/avatars/ProfilePics/cat.jpg",
  bio: "Frontend Developer",
  branch: "ECE",
  year: 2029,
  instituteId: "B25EC019",
  github: "https://github.com/Inovate-Ishaan",
  linkedin: "https://www.linkedin.com/in/ishaan-shukla-a42bb2376?utm_source=share_via&utm_content=profile&utm_medium=member_android",
  website: null,
  emailVerified: true
  },

  {
  username: "pawanbhai",
  email: "pawan@iitbhilai.ac.in",
  password: hashed,
  displayname: "Pawan Teja",
  avatar: "/avatars/ProfilePics/cat.jpg",
  bio: "Backend Developer",
  branch: "CSE",
  year: 2029,
  instituteId: "B25CS032",
  github: "https://github.com/PawanTeja-Max",
  linkedin: "PawanTeja",
  website: null,
  emailVerified: true
  },

  {
  username: "DIVY",
  email: "dkori@iitbhilai.ac.in",
  password: hashed,
  displayname: "Divyansh Kori",
  avatar: "/avatars/ProfilePics/cat.jpg",
  bio: "Frontend Developer",
  branch: "CSE",
  year: 2029,
  instituteId: "B25CS016",
  github: "https://github.com/Divvyansh02",
  linkedin: "DivyanshKori",
  website: null,
  emailVerified: true
  },

  {
  username: "ananya",
  email: "ananya@iitbhilai.ac.in",
  password: hashed,
  displayname: "Ananya Gupta",
  avatar: "/avatars/ProfilePics/cat.jpg",
  bio: "Machine Learning Engineer",
  branch: "CSE",
  year: 2020,
  instituteId: "B16CS009",
  github: "ananyagupta",
  linkedin: "ananyagupta",
  website: null,
  emailVerified: true
  },

  {
  username: "vikram",
  email: "vikram@iitbhilai.ac.in",
  password: hashed,
  displayname: "Vikram Singh",
  avatar: "/avatars/ProfilePics/cat.jpg",
  bio: "DevOps Engineer",
  branch: "CSE",
  year: 2022,
  instituteId: "B18CS009",
  github: "vikramsingh",
  linkedin: "vikramsingh",
  website: null,
  emailVerified: true
  },

  {
  username: "meera",
  email: "meera@iitbhilai.ac.in",
  password: hashed,
  displayname: "Meera Iyer",
  avatar: "/avatars/ProfilePics/cat.jpg",
  bio: "UI/UX Designer",
  branch: "CSE",
  year: 2028,
  instituteId: "B24CS009",
  github: "meeraiyer",
  linkedin: "meeraiyer",
  website: null,
  emailVerified: true
  },

  {
  username: "harsha",
  email: "harsha@iitbhilai.ac.in",
  password: hashed,
  displayname: "Harsha Vardhan",
  avatar: "/avatars/ProfilePics/cat.jpg",
  bio: "Competitive Programmer",
  branch: "CSE",
  year: 2027,
  instituteId: "B23CS009",
  github: "harshav",
  linkedin: "harshav",
  website: null,
  emailVerified: true
  },

  {
  username: "neha",
  email: "neha@iitbhilai.ac.in",
  password: hashed,
  displayname: "Neha Kapoor",
  avatar: "/avatars/ProfilePics/cat.jpg",
  bio: "Cyber Security Enthusiast",
  branch: "CSE",
  year: 2026,
  instituteId: "B22CS009",
  github: "nehakapoor",
  linkedin: "nehakapoor",
  website: null,
  emailVerified: true
  },

  {
  username: "kavya",
  email: "kavya@iitbhilai.ac.in",
  password: hashed,
  displayname: "Kavya Reddy",
  avatar: "/avatars/ProfilePics/cat.jpg",
  bio: "Full Stack Developer",
  branch: "ECE",
  year: 2028,
  instituteId: "B24EC019",
  github: "kavyareddy",
  linkedin: "kavyareddy",
  website: null,
  emailVerified: true
  },

  {
  username: "arjun",
  email: "arjun@iitbhilai.ac.in",
  password: hashed,
  displayname: "Arjun Nair",
  avatar: "/avatars/ProfilePics/cat.jpg",
  bio: "Open Source Contributor",
  branch: "CSE",
  year: 2021,
  instituteId: "B17CS009",
  github: "arjunnair",
  linkedin: "arjunnair",
  website: null,
  emailVerified: true
  },

  {
  username: "sarah",
  email: "sarah@iitbhilai.ac.in",
  password: hashed,
  displayname: "Sarah Wilson",
  avatar: "/avatars/ProfilePics/cat.jpg",
  bio: "Cloud Engineer",
  branch: "CSE",
  year: 2024,
  instituteId: "B20CS009",
  github: "sarahwilson",
  linkedin: "sarahwilson",
  website: null,
  emailVerified: true
  }
  ]
  });

  console.log("Users Seeded");

  console.log("Generating Posts...");

  // identifying tags and users for maintaining user post with tags realtion
  const dbUsers = await prisma.user.findMany();
  const dbTags = await prisma.tags.findMany();

  const generatedPosts = [];

  for(let i=0;i<15;i++){
      const template = postLibrary[i % postLibrary.length];
      generatedPosts.push({
          author: dbUsers[i % dbUsers.length].username,
          title: template.title + " #" + (Math.floor(i/postLibrary.length)+1),
          content: template.content,
          tags: template.tags,
          coverImage: template.coverImage,
          githubUrl: template.githubUrl
      });
  }

  for(const item of generatedPosts){
    const author = dbUsers.find(
        u => u.username === item.author
    );

    const createdPost = await prisma.post.create({
        data:{
          title:item.title,
          content:item.content,
          coverImage:item.coverImage,
          authorId:author.id,
          createdAt:new Date(Date.now() - randomInt(0,90) * 86400000),
          githubUrl: item.githubUrl
        }
    });

    for(const tagName of item.tags){
        await prisma.postTag.create({
            data:{postId:createdPost.id,
              tagId:getTagId(dbTags,tagName)
            }
          });
      }
  }
  console.log("Posts Seeded")

  // identifying posts such that user doesn't bookmark his own posts
  const dbPosts = await prisma.post.findMany({
    include: {author: true}
  });

  console.log("Creating Bookmarks")

  for (const user of dbUsers) {
    // Posts that are NOT written by this user
    const availablePosts = dbPosts.filter(
        post => post.authorId !== user.id
    );

    // Shuffle
    availablePosts.sort(() => Math.random() - 0.5);

    // Each user bookmarks 5-10 posts
    const totalBookmarks = randomInt(5,10);
    const selectedPosts = availablePosts.slice(0, totalBookmarks);
    for (const post of selectedPosts){
      await prisma.bookmark.create({
          data: {
            username: user.username,
            postId: post.id
          }
      });
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
