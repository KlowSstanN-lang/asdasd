// Anahtarlar
const USERS_KEY = 'users';
const LOGGED_IN_KEY = 'loggedInUser';
const DUYURULAR_KEY = 'duyurular';
const FORUMLAR_KEY = 'forumlar';

// Kullanıcı işlemleri
function loadUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getLoggedInUser() {
  return JSON.parse(localStorage.getItem(LOGGED_IN_KEY));
}

function login() {
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;

  const user = loadUsers().find(u => u.username === username && u.password === password);
  if (!user) return alert("Geçersiz kullanıcı adı veya şifre.");

  localStorage.setItem(LOGGED_IN_KEY, JSON.stringify(user));
  window.location.href = 'anasayfa.html';
}

function logout() {
  localStorage.removeItem(LOGGED_IN_KEY);
  window.location.href = 'index.html';
}

function register() {
  const username = document.getElementById('register-username').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;

  if (!username || !email || !password) return alert("Tüm alanları doldurun.");

  const users = loadUsers();
  if (users.find(u => u.username === username)) return alert("Kullanıcı adı zaten alınmış.");

  const newUser = {
    username,
    email,
    password,
    role: 'üye',
    joinedAt: new Date().toISOString()
  };

  users.push(newUser);
  saveUsers(users);
  alert("Kayıt başarılı. Şimdi giriş yapabilirsiniz.");
  toggleRegister(false);
}

function toggleRegister(show = true) {
  const section = document.getElementById("register-section");
  if (section) section.classList.toggle("hidden", !show);
}

// Profil Şifre Güncelleme
function changePassword() {
  const oldPass = document.getElementById("old-password").value;
  const newPass = document.getElementById("new-password").value;
  const user = getLoggedInUser();

  if (!user || oldPass !== user.password) return alert("Eski şifre yanlış.");
  if (newPass.length < 4) return alert("Yeni şifre en az 4 karakter olmalıdır.");

  const users = loadUsers();
  const index = users.findIndex(u => u.username === user.username);
  users[index].password = newPass;
  saveUsers(users);

  user.password = newPass;
  localStorage.setItem(LOGGED_IN_KEY, JSON.stringify(user));
  alert("Şifre başarıyla güncellendi.");
}

// Admin Panel: Kullanıcı Rütbe İşlemleri
function promoteUser(index) {
  const users = loadUsers();
  users[index].role = 'admin';
  saveUsers(users);
}

function demoteUser(index) {
  const users = loadUsers();
  users[index].role = 'üye';
  saveUsers(users);
}

function deleteUser(index) {
  const users = loadUsers();
  users.splice(index, 1);
  saveUsers(users);
}

// -------------------------
// Duyuru İşlemleri
// -------------------------
function loadDuyurular() {
  return JSON.parse(localStorage.getItem(DUYURULAR_KEY)) || [];
}

function saveDuyurular(duyurular) {
  localStorage.setItem(DUYURULAR_KEY, JSON.stringify(duyurular));
}

function addDuyuru(baslik, icerik) {
  const duyurular = loadDuyurular();
  const user = getLoggedInUser();
  duyurular.unshift({
    baslik,
    icerik,
    tarih: new Date().toLocaleString(),
    yazar: user.username
  });
  saveDuyurular(duyurular);
}

function renderDuyurular(containerId) {
  const duyurular = loadDuyurular();
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = "";

  duyurular.forEach(d => {
    const div = document.createElement("div");
    div.className = "content-box";
    div.innerHTML = `<strong>${d.baslik}</strong> - ${d.yazar} (${d.tarih})<br><p>${d.icerik}</p>`;
    container.appendChild(div);
  });
}

// -------------------------
// Forum İşlemleri
// -------------------------
function loadForumlar() {
  return JSON.parse(localStorage.getItem(FORUMLAR_KEY)) || [];
}

function saveForumlar(forumlar) {
  localStorage.setItem(FORUMLAR_KEY, JSON.stringify(forumlar));
}

function addKonu(baslik, icerik) {
  const forumlar = loadForumlar();
  const user = getLoggedInUser();
  forumlar.unshift({
    baslik,
    icerik,
    yazar: user.username,
    rol: user.role,
    yorumlar: [],
    tarih: new Date().toLocaleString()
  });
  saveForumlar(forumlar);
}

function addYorum(konuIndex, yorum) {
  const forumlar = loadForumlar();
  const user = getLoggedInUser();
  forumlar[konuIndex].yorumlar.push({
    yorum,
    yazar: user.username,
    rol: user.role,
    tarih: new Date().toLocaleString()
  });
  saveForumlar(forumlar);
}

function deleteKonu(index) {
  const forumlar = loadForumlar();
  forumlar.splice(index, 1);
  saveForumlar(forumlar);
}

function deleteYorum(konuIndex, yorumIndex) {
  const forumlar = loadForumlar();
  forumlar[konuIndex].yorumlar.splice(yorumIndex, 1);
  saveForumlar(forumlar);
}

// -------------------------
// Anasayfa Yetkilileri Göster
// -------------------------
function renderYetkililer(containerId) {
  const users = loadUsers();
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = "";
  users.filter(u => u.role === "admin").forEach(admin => {
    const li = document.createElement("li");
    li.textContent = `${admin.username} (${admin.email})`;
    container.appendChild(li);
  });
}
