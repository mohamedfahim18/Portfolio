(() => {
    const cursor = document.querySelector('.cursor') || (() => {
        const customCursor = document.createElement('div');
        customCursor.className = 'cursor';
        customCursor.style.backgroundImage = 'url("cursor.png")';
        document.body.appendChild(customCursor);
        return customCursor;
    })();

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;

    const moveCursor = (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
    };

    document.addEventListener('mousemove', moveCursor);

    const animateCursor = () => {
        cursorX += (mouseX - cursorX) * 0.18;
        cursorY += (mouseY - cursorY) * 0.18;
        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;
        requestAnimationFrame(animateCursor);
    };

    requestAnimationFrame(animateCursor);

    const interactiveElements = document.querySelectorAll('a, button, input, textarea, select, .skillbox, .nav-dropdown, .arc, .certbtn, .addbtn');

    interactiveElements.forEach((element) => {
        element.addEventListener('mouseenter', () => cursor.classList.add('is-hovering'));
        element.addEventListener('mouseleave', () => cursor.classList.remove('is-hovering'));
    });

    const navbar = document.querySelector('.navbar');
    const topLogo = document.querySelector('.top-logo');
    const sections = [...document.querySelectorAll('main section[id]')];
    const navLinks = [...document.querySelectorAll('nav a, .navbar a')];
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const clearActiveNavStates = () => {
        document.querySelectorAll('nav p, .navbar p').forEach((item) => {
            item.classList.remove('active', 'is-active');
        });
    };

    const setActiveNavItem = (targetHref) => {
        if (!targetHref) return;

        clearActiveNavStates();

        const activeLink = document.querySelector(`nav a[href="${targetHref}"] , .navbar a[href="${targetHref}"]`);
        const parent = activeLink ? activeLink.closest('p') : null;

        if (parent) {
            parent.classList.add('active', 'is-active');
        }
    };

    const setPageActiveState = () => {
        const currentPage = (window.location.pathname.split('/').pop() || 'home.html').toLowerCase();
        const pageLink = document.querySelector(`nav a[href$="${currentPage}"], .navbar a[href$="${currentPage}"]`);

        if (pageLink) {
            setActiveNavItem(pageLink.getAttribute('href'));
            return;
        }

        if (currentPage === 'home.html') {
            setActiveNavItem('#home');
        }
    };

    if (!navbar || !topLogo || !sections.length || !navLinks.length) {
        setPageActiveState();
        return;
    }

    const navbarDocumentTop = navbar.getBoundingClientRect().top + window.scrollY;

    // The navbar is placed in normal flow first, then becomes sticky once it reaches the viewport top.
    const updateStickyState = () => {
        const isStuck = window.scrollY >= navbarDocumentTop + 1;
        navbar.classList.toggle('is-stuck', isStuck);
    };

    // The logo remains in the layout while it fades out and back in as the user scrolls past the navbar.
    let lastScrollY = window.scrollY;
    const updateLogoVisibility = () => {
        const currentScroll = window.scrollY;
        const scrollDown = currentScroll > lastScrollY;
        const shouldHide = scrollDown && currentScroll > navbarDocumentTop + 8;

        if (shouldHide) {
            topLogo.classList.add('is-hidden');
        } else if (!scrollDown) {
            topLogo.classList.remove('is-hidden');
        }

        lastScrollY = currentScroll;
    };

    const scrollToSection = (targetId) => {
        const section = document.querySelector(targetId);
        if (!section) return;

        const portrait = document.querySelector('.profile .pic');
        const target = targetId === '#home'
            ? portrait && portrait.getClientRects().length
                ? portrait
                : document.querySelector('.profile') || section
            : section;
        const navbarHeight = navbar.getBoundingClientRect().height;
        const gap = targetId === '#home' ? 8 : 0;
        const offsetTop = target.getBoundingClientRect().top + window.scrollY - navbarHeight - gap;

        window.scrollTo({
            top: offsetTop,
            behavior: reducedMotion ? 'auto' : 'smooth'
        });
    };

    // Smooth section navigation with a dynamic offset so the sticky navbar never covers the section heading.
    navLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            const targetId = link.getAttribute('href');
            if (!targetId) return;

            setActiveNavItem(targetId);

            if (!targetId.startsWith('#')) return;

            const targetSection = document.querySelector(targetId);
            if (!targetSection) return;

            event.preventDefault();
            scrollToSection(targetId);
        });
    });

    document.querySelectorAll('[data-target^="#"]').forEach((control) => {
        control.addEventListener('click', () => scrollToSection(control.dataset.target));
    });

    const updateCurrentSectionNav = () => {
        if (!sections.length) return;

        const viewportOffset = window.scrollY + 180;
        let currentSection = sections[0];
        let smallestDistance = Infinity;

        sections.forEach((section) => {
            const distance = Math.abs(section.offsetTop - viewportOffset);
            if (distance < smallestDistance) {
                smallestDistance = distance;
                currentSection = section;
            }
        });

        setActiveNavItem(`#${currentSection.id}`);
    };

    setPageActiveState();
    updateCurrentSectionNav();
    updateStickyState();
    updateLogoVisibility();
    window.addEventListener('scroll', () => {
        updateCurrentSectionNav();
        updateStickyState();
        updateLogoVisibility();
    }, { passive: true });
    window.addEventListener('resize', () => {
        updateCurrentSectionNav();
        updateStickyState();
        updateLogoVisibility();
    });
})();

const firebaseConfig = {
  apiKey: "AIzaSyCAzkEwh-flxyLWAfAlka2j8JuU2zc3SKw",
  authDomain: "mdf-portfolio.firebaseapp.com",
  databaseURL: "https://mdf-portfolio-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "mdf-portfolio",
  storageBucket: "mdf-portfolio.firebasestorage.app",
  messagingSenderId: "521654158862",
  appId: "1:521654158862:web:86b7a021586756a4295e5f",
  measurementId: "G-QKL7C7HZ0G"
};

let secret = "";

document.addEventListener("keydown", function(e){

    secret += e.key.toLowerCase();
    if(secret.includes("batman")){
        location.href = "login.html";
    }

    if(secret.includes("terminate")){
        logout();
    }
});



firebase.initializeApp(firebaseConfig);

const database = firebase.database();

const projectsRef = database.ref("projects");

const certificatesRef = database.ref("certificates");

const achievementsRef = database.ref("achievements");

const experienceRef = database.ref("experience");

console.log("Firebase Connected");


function showpopup(){
    document.getElementById("popup").style.display="block";
}

function closepopup(){
    document.getElementById("popup").style.display="none";
}

function showAchievementPopup(){
    document.getElementById("achievementPopup").style.display="block";
}

function closeAchievementPopup(){
    document.getElementById("achievementPopup").style.display="none";
}

function showExperiencePopup(){
    document.getElementById("experiencePopup").style.display="block";
}

function closeExperiencePopup(){
    document.getElementById("experiencePopup").style.display="none";
}

function openimg(){
    document.getElementById("imgfile").click();
}



function addProject(){

    const name =
    document.getElementById("projectName").value;

    const tech =
    document.getElementById("techStack").value;

    const repo =
    document.getElementById("repoLink").value;

    const desc =
    document.getElementById("description").value;

    projectsRef.push({
        name: name,
        tech: tech,
        repo: repo,
        desc: desc
    });

    closepopup();
}


firebase.auth().onAuthStateChanged(function(user){

    const projectBtn = document.getElementById("btn");
    const addcert = document.querySelector(".addcert");
    const addAchievementBtn = document.getElementById("addAchievementBtn");
    const addExperienceBtn = document.getElementById("addExperienceBtn");

    if(user){

        if(projectBtn) projectBtn.style.display = "block";
        if(addcert) addcert.style.display = "block";
        if(addAchievementBtn) addAchievementBtn.style.display = "block";
        if(addExperienceBtn) addExperienceBtn.style.display = "block";

    }else{

        if(projectBtn) projectBtn.style.display = "none";
        if(addcert) addcert.style.display = "none";
        if(addAchievementBtn) addAchievementBtn.style.display = "none";
        if(addExperienceBtn) addExperienceBtn.style.display = "none";

    }

    loadProjects(user);

});

function loadProjects(user){

    projectsRef.on("value", function(snapshot){

        const container =
        document.getElementById("projectsContainer");

        if(!container) return;

        container.innerHTML = "";

        snapshot.forEach(function(child){

            const key = child.key;
            const project = child.val();

            const card =
            document.createElement("div");

            card.className = "project";

            card.innerHTML = `
                <h2>${project.name}</h2>

                <p>${project.tech}</p>

                <p>${project.desc}</p>

                <button
                class="githubBtn"
                onclick="window.open('${project.repo}', '_blank')">
                    GitHub Link >>>
                </button>

                <br><br>

                <button
                style="display:${user ? "block" : "none"}"
                class="btn deleteBtn">
                    Delete
                </button>
            `;

            card.querySelector(".deleteBtn")
            .addEventListener("click", function(){

                if(confirm("Delete this project?")){

                    projectsRef.child(key).remove();

                }

            });

            container.appendChild(card);

        });

    });

}

function skillsbox(){

    const scope = window.portfolioInteractionScope || document;
    const skill = scope.querySelector("#skill");
    const skillset1 = scope.querySelector("#skillset1");
    const skillset2 = scope.querySelector("#skillset2");
    const arc = scope.querySelector(".arc");

    if(!skill || !skillset1 || !skillset2 || !arc) return;

    skill.classList.toggle("show");

    if(skill.classList.contains("show")){

        skillset1.classList.add("hide");
        skillset2.classList.add("hide");

        setTimeout(() => {
            skillset1.style.display = "none";
            skillset2.style.display = "none";
        }, 800);

        arc.style.filter =
        "drop-shadow(0 0 30px #00BFFF) drop-shadow(0 0 60px rgba(0,191,255,0.6))";

    }else{

        skillset1.style.display = "block";
        skillset2.style.display = "block";

        setTimeout(() => {
            skillset1.classList.remove("hide");
            skillset2.classList.remove("hide");
        }, 50);

        arc.style.filter = "none";

    }

}


function login(){

    var deny =
    document.getElementById("deny");

    var email =
    document.getElementById("username").value;

    var password =
    document.getElementById("password").value;

    firebase.auth()
    .signInWithEmailAndPassword(email, password)

    .then(function(){

        window.location.href = "home.html";

    })

    .catch(function(){

        deny.style.display = "block";

    });

}

function logout(){

    firebase.auth().signOut()

    .then(function(){

        alert("Admin Session Terminated");

        window.location.href = "home.html";

    });

}

function addCertificate(){

    const file =
    document.getElementById("certFile").files[0];

    if(!file) return;

    const title =
    prompt("Enter Certificate Title:");

    const reader =
    new FileReader();

    reader.onload = function(e){

        certificatesRef.push({

            title: title,

            image: e.target.result

        });

    };

    reader.readAsDataURL(file);

}

function addAchievement(){

    const achievementText =
    document.getElementById("achievementText").value;

    if(!achievementText) return;

    achievementsRef.push({
        text: achievementText
    });

    closeAchievementPopup();
    document.getElementById("achievementText").value = "";
}

function addExperience(){

    const experienceText =
    document.getElementById("experienceText").value;

    if(!experienceText) return;

    experienceRef.push({
        text: experienceText
    });

    closeExperiencePopup();
    document.getElementById("experienceText").value = "";
}

function openCertUpload(){

    document.getElementById("certFile").click();

}

const certContainer =
document.getElementById("certificatesContainer");

if(certContainer){

    certificatesRef.on("value", function(snapshot){

        certContainer.innerHTML = "";

        snapshot.forEach(function(child){

            const cert = child.val();

            const card =
            document.createElement("div");

            card.className = "certificate";

            card.innerHTML = `
                <img src="${cert.image}">

                <h2>${cert.title}</h2>
            `;

            certContainer.appendChild(card);

        });

    });

}

const achievementsContainer =
document.getElementById("achievementsContainer");

if(achievementsContainer){

    achievementsRef.once("value", function(snapshot){

        if(!snapshot.exists()){

            const initialAchievements = [
                "Solved 170+ Leetcode Problems",
                "Second Prize - Creative Writing Competition",
                "CISCO Networking Academy Certifications",
                "Tamil Nadu Government Typewriting Certification",
                "Current CGPA: 9.27 (After 2nd Semester)"
            ];

            initialAchievements.forEach(function(achievement){
                achievementsRef.push({
                    text: achievement
                });
            });
        }

    });

    achievementsRef.on("value", function(snapshot){

        achievementsContainer.innerHTML = "";

        let index = 1;

        snapshot.forEach(function(child){

            const key = child.key;
            const achievement = child.val();

            const achievementDiv =
            document.createElement("div");

            achievementDiv.className = "achievement-item";

            achievementDiv.innerHTML = `
                <h2>${index}. ${achievement.text}</h2>
            `;

            achievementsContainer.appendChild(achievementDiv);

            index++;

        });

    });

}

const experienceContainer =
document.getElementById("experienceContainer");

if(experienceContainer){

    experienceRef.once("value", function(snapshot){

        if(!snapshot.exists()){

            const initialExperience = [
                "Open Source Contributions (GSSoC'26)",
                "AI Web Development Internship",
                "Freelance Document Typist"
            ];

            initialExperience.forEach(function(exp){
                experienceRef.push({
                    text: exp
                });
            });
        }

    });

    experienceRef.on("value", function(snapshot){

        experienceContainer.innerHTML = "";

        let index = 1;

        snapshot.forEach(function(child){

            const key = child.key;
            const experience = child.val();

            const experienceDiv =
            document.createElement("div");

            experienceDiv.className = "achievement-item";

            experienceDiv.innerHTML = `
                <h2>${index}. ${experience.text}</h2>
            `;

            experienceContainer.appendChild(experienceDiv);

            index++;

        });

    });

}

const cube = document.getElementById("cube");

const cubeTitle = document.getElementById("cube-title");
const cubeDescription = document.getElementById("cube-description");

let currentX = -15;
let currentY = -25;

const cubeData = {

    developer: {
        title: "DEVELOPER",
        description: "Building meaningful web applications through code, logic and creativity."
    },

    creator: {
        title: "CREATOR",
        description: "Turning imagination and ideas into something meaningful."
    },

    learner: {
        title: "LEARNER",
        description: "Continuously exploring technologies and improving my skills."
    },

    writer: {
        title: "WRITER",
        description: "Expressing ideas through storytelling and creative writing."
    },

    contributor: {
        title: "CONTRIBUTOR",
        description: "Contributing to open source and learning through collaboration."
    },

    innovator: {
        title: "INNOVATOR",
        description: "Exploring new possibilities and finding creative solutions."
    }

};


// ROTATE CUBE

function rotateCube(direction) {

    currentY += direction * 90;

    cube.style.transform =
        `rotateX(${currentX}deg) rotateY(${currentY}deg)`;

}


// RESET CUBE

function resetCube() {

    currentX = -15;
    currentY = -25;

    cube.style.transform =
        `rotateX(${currentX}deg) rotateY(${currentY}deg)`;

    updateCubeInfo("developer");

}


// CLICK FACE TO EXPLORE

document.querySelectorAll(".cube-face").forEach(face => {

    face.addEventListener("click", () => {

        const selected = face.dataset.face;

        const rotations = {
            developer: [ -15, 0 ],
            creator: [ -15, 180 ],
            learner: [ -15, -90 ],
            writer: [ -15, 90 ],
            contributor: [ -105, 0 ],
            innovator: [ 75, 0 ]
        };

        [currentX, currentY] = rotations[selected];

        cube.style.transform =
            `rotateX(${currentX}deg) rotateY(${currentY}deg)`;

        updateCubeInfo(selected);

    });

});


// UPDATE INFORMATION

function updateCubeInfo(selected) {

    cubeTitle.textContent = cubeData[selected].title;

    cubeDescription.textContent =
        cubeData[selected].description;

}