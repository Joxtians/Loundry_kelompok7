document.addEventListener('DOMContentLoaded', () => {

    // !! BARU !!
    // Panggil fungsi pengecekan status login setiap kali halaman dimuat
    checkLoginStatus();

    // 1. Logika Pop-up Customer Service (CS)
    const contactBtn = document.getElementById('contact-btn');
    const csPopup = document.getElementById('popup-cs');

    if (contactBtn && csPopup) {
        contactBtn.onclick = (e) => {
            e.preventDefault();
            let currentCsPopup = document.getElementById('popup-cs');
            if (currentCsPopup) {
                // (Konten pop-up CS Anda...)
                currentCsPopup.style.display = 'block';
            }
        };
    }

    // Logika untuk menutup pop-up
    document.body.addEventListener('click', (event) => {
        if (event.target.classList.contains('close-btn')) {
            event.target.closest('.modal').style.display = 'none';
        }
    });
    window.onclick = (event) => {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    };


    // 2. Logika Formulir Login (untuk index.html)
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // (validasi username/password bisa ditambahkan di sini)

            // !! BARU: Simpan status login di sessionStorage
            // sessionStorage hanya menyimpan data selama tab browser terbuka
            sessionStorage.setItem('isLoggedIn', 'true');
            
            alert('Login Berhasil! Selamat Datang di JLF & Co. Laundry.');
            window.location.href = 'beranda.html'; // Arahkan ke beranda
        });
    }

    // 3. Logika Formulir Register (untuk register.html)
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // (validasi form registrasi...)
            alert('Registrasi Berhasil! Silakan Masuk.');
            window.location.href = 'index.html'; // Kembali ke login
        });
    }

    // 4. !! BARU !! Logika Tombol Logout (untuk akun.html)
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.onclick = () => {
            handleLogout();
        };
    }
});

// !! FUNGSI BARU !!
// Fungsi ini memeriksa status login dan mengubah header
function checkLoginStatus() {
    // Cari tombol auth berdasarkan ID yang kita tambahkan di HTML
    const authLinkContainer = document.getElementById('nav-auth-link');

    // Jika tidak ada tombolnya (mungkin di halaman login/register), hentikan fungsi
    if (!authLinkContainer) {
        return;
    }

    // Cek apakah data 'isLoggedIn' ada di sessionStorage
    if (sessionStorage.getItem('isLoggedIn') === 'true') {
        // Jika user sudah login
        // Ganti HTML tombol menjadi "Akun Saya"
        authLinkContainer.innerHTML = '<a href="akun.html" class="active">Akun Saya</a>';
        
        // Sesuaikan style jika perlu (misalnya, .active)
        // Jika Anda berada di halaman akun.html, tambahkan kelas 'active'
        if (window.location.pathname.endsWith('akun.html')) {
             authLinkContainer.querySelector('a').classList.add('active');
        }

    } else {
        // Jika user belum login, pastikan tombolnya adalah "Login"
        // (Ini sudah default dari HTML, tapi baik untuk konsistensi)
        authLinkContainer.innerHTML = '<a href="index.html">Login</a>';
    }
}

// !! FUNGSI BARU !!
// Fungsi untuk LOGOUT
function handleLogout() {
    // Hapus status login dari sessionStorage
    sessionStorage.removeItem('isLoggedIn');
    alert('Anda telah berhasil logout.');
    // Arahkan kembali ke halaman login
    window.location.href = 'index.html';
}
