document.addEventListener('DOMContentLoaded', () => {
  const getStartedBtn = document.getElementById('get-started-btn');
  const aboutLink = document.getElementById('nav-about');
  const navCourses = document.getElementById('nav-courses');

  const mainContent = document.getElementById('main-content');
  const loginSection = document.getElementById('login-section');
  const signupSection = document.getElementById('signup-section');
  const aboutSection = document.getElementById('about-section');

  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');

  const message = document.getElementById('loginMessage');
  const signupMessage = document.getElementById('signupMessage');

  const backBtnLogin = document.getElementById('back-to-home');
  const backBtnSignup = document.getElementById('back-to-home-signup');
  const backBtnAbout = document.getElementById('back-to-home-about');

  const fullMain = document.getElementById('full-main');
  const gradeSelectionPage = document.getElementById('grade-selection-page');
  const backToFullMain = document.getElementById('back-to-full-main');

  // Show login form
  loginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    mainContent.style.display = 'block';
    fullMain.style.display = 'none';
    gradeSelectionPage.style.display = 'none';
    loginSection.style.display = 'block';
    signupSection.style.display = 'none';
    aboutSection.style.display = 'none';
    message.textContent = '';
  });

  // Show signup form (via Get Started)
  getStartedBtn.addEventListener('click', (e) => {
    e.preventDefault();
    mainContent.style.display = 'block';
    fullMain.style.display = 'none';
    gradeSelectionPage.style.display = 'none';
    signupSection.style.display = 'block';
    loginSection.style.display = 'none';
    aboutSection.style.display = 'none';
    signupMessage.textContent = '';
  });

  // Back from login
  backBtnLogin.addEventListener('click', (e) => {
    e.preventDefault();
    loginSection.style.display = 'none';
    mainContent.style.display = 'block';
    fullMain.style.display = 'block';
    loginForm.reset();
    message.textContent = '';
  });

  // Back from signup
  backBtnSignup.addEventListener('click', (e) => {
    e.preventDefault();
    signupSection.style.display = 'none';
    mainContent.style.display = 'block';
    fullMain.style.display = 'block';
    signupForm.reset();
    signupMessage.textContent = '';
  });

  // Show About section
  aboutLink.addEventListener('click', (e) => {
    e.preventDefault();
    mainContent.style.display = 'block';
    fullMain.style.display = 'none';
    gradeSelectionPage.style.display = 'none';
    loginSection.style.display = 'none';
    signupSection.style.display = 'none';
    aboutSection.style.display = 'block';
  });

  // Back from About
  backBtnAbout.addEventListener('click', (e) => {
    e.preventDefault();
    aboutSection.style.display = 'none';
    mainContent.style.display = 'block';
    fullMain.style.display = 'block';
  });

  // Courses click -> show grade selection page only
  navCourses.addEventListener('click', (e) => {
    e.preventDefault();
    mainContent.style.display = 'block';
    fullMain.style.display = 'none';
    gradeSelectionPage.style.display = 'block';
    loginSection.style.display = 'none';
    signupSection.style.display = 'none';
    aboutSection.style.display = 'none';
  });

  document.querySelectorAll('.explore-courses-btn').forEach(button => {
  button.addEventListener('click', (e) => {
    e.preventDefault();
    mainContent.style.display = 'block';
    fullMain.style.display = 'none';
    gradeSelectionPage.style.display = 'block';
    loginSection.style.display = 'none';
    signupSection.style.display = 'none';
    aboutSection.style.display = 'none';
  });
});

  // Back button on grade selection page -> back to full main (hero + grade cards)
  backToFullMain.addEventListener('click', (e) => {
    e.preventDefault();
    gradeSelectionPage.style.display = 'none';
    fullMain.style.display = 'block';
  });

  // Login form submission
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = loginForm.email.value.trim();
    const password = loginForm.password.value.trim();
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    if (!email || !password) {
      message.style.color = 'red';
      message.textContent = 'Please enter both email and password.';
      return;
    }

    const user = users.find(
      (user) => user.email.toLowerCase() === email.toLowerCase() && user.password === password
    );

    if (user) {
      message.style.color = 'green';
      message.textContent = 'Login successful! Redirecting...';

      setTimeout(() => {
        alert(`Welcome to your dashboard, ${user.name}!`);
        loginSection.style.display = 'none';
        mainContent.style.display = 'block';
        fullMain.style.display = 'block';
        loginForm.reset();
        message.textContent = '';
      }, 1500);
    } else {
      message.style.color = 'red';
      message.textContent = 'Invalid email or password.';
    }
  });

  // Signup form submission
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = signupForm.name.value.trim();
    const studentId = signupForm.studentId.value.trim();
    const email = signupForm.email.value.trim();
    const password = signupForm.password.value.trim();
    const confirmPassword = signupForm.confirmPassword.value.trim();

    if (!name || !studentId || !email || !password || !confirmPassword) {
      signupMessage.style.color = 'red';
      signupMessage.textContent = 'Please fill in all fields.';
      return;
    }

    if (!validateEmail(email)) {
      signupMessage.style.color = 'red';
      signupMessage.textContent = 'Please enter a valid email address.';
      return;
    }

    if (password.length < 6) {
      signupMessage.style.color = 'red';
      signupMessage.textContent = 'Password must be at least 6 characters.';
      return;
    }

    if (password !== confirmPassword) {
      signupMessage.style.color = 'red';
      signupMessage.textContent = 'Passwords do not match.';
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');

    if (users.some((user) => user.email.toLowerCase() === email.toLowerCase())) {
      signupMessage.style.color = 'red';
      signupMessage.textContent = 'Email already registered.';
      return;
    }

    users.push({ name, studentId, email, password });
    localStorage.setItem('users', JSON.stringify(users));

    signupMessage.style.color = 'green';
    signupMessage.textContent = 'Account created successfully! You can now log in.';

    setTimeout(() => {
      signupSection.style.display = 'none';
      mainContent.style.display = 'block';
      fullMain.style.display = 'block';
      signupForm.reset();
      signupMessage.textContent = '';
    }, 1500);
  });

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
});

// Handle grade selection → subject selection
document.querySelectorAll('.select-grade').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('grade-selection-page').style.display = 'none';
    document.getElementById('subject-selection-page').style.display = 'block';
  });
});

// Back from subject selection → grade selection
document.getElementById('back-to-grades').addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('subject-selection-page').style.display = 'none';
  document.getElementById('grade-selection-page').style.display = 'block';
});

// Handle subject form submission
document.getElementById('subject-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const selectedSubjects = Array.from(document.querySelectorAll('input[name="subject"]:checked')).map(el => el.value);
  if (selectedSubjects.length === 0) {
    alert("Please select at least one subject.");
    return;
  }
  alert(`You selected: ${selectedSubjects.join(', ')} ✅`);
});