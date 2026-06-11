// frontend/js/auth.js
document.addEventListener("DOMContentLoaded", () => {
    
    // Hàm phụ trợ giúp bật/tắt trạng thái loading cho nút bấm để tránh double-click
    const setSubmitting = (formElement, isSubmitting) => {
        const submitBtn = formElement.querySelector("[type='submit']");
        if (!submitBtn) return;
        submitBtn.disabled = isSubmitting;
        if (isSubmitting) {
            submitBtn.dataset.originalText = submitBtn.innerText;
            submitBtn.innerText = "⏳ Đang xử lý...";
        } else {
            submitBtn.innerText = submitBtn.dataset.originalText || "Gửi";
        }
    };

    // ==========================================
    // 1. XỬ LÝ ĐĂNG NHẬP
    // ==========================================
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value;

            if (!email || !password) {
                alert("❌ Vui lòng nhập đầy đủ email và mật khẩu!");
                return;
            }

            try {
                setSubmitting(loginForm, true);
                const res = await apiFetch("/auth/login", {
                    method: "POST",
                    body: { email, password }
                });

                if (res && res.success && res.token) {
                    // Dọn dẹp bộ nhớ cũ tránh xung đột quyền
                    localStorage.clear();

                    // Lưu trạng thái đăng nhập
                    localStorage.setItem("token", res.token);
                    localStorage.setItem("role", res.role);
                    
                    const userData = {
                        email: email,
                        vai_tro: res.role
                    };
                    localStorage.setItem("user", JSON.stringify(userData));

                    alert("🎉 Đăng nhập thành công! Đang chuyển hướng hệ thống...");

                    // 🛠️ ĐOẠN ĐƯỢC SỬA: Tự động tính toán đường dẫn động dựa trên URL Live Server
                    const currentPath = window.location.pathname;
                    let basePath = "";

                    if (currentPath.includes("/ebikes-rental-system/")) {
                        basePath = "/ebikes-rental-system/frontend";
                    } else if (currentPath.includes("/frontend/")) {
                        basePath = "/frontend";
                    } else {
                        basePath = "";
                    }

                    // Điều hướng chính xác theo sơ đồ thư mục thực tế
                    if (res.role === "admin") {
                        window.location.href = basePath + "/admin/dashboard.html";
                    } else {
                        window.location.href = basePath + "/customer/home.html";
                    }

                } else {
                    alert(`❌ Đăng nhập thất bại: ${res?.message || "Tài khoản hoặc mật khẩu không đúng."}`);
                }
            } catch (error) {
                console.error("Login Error:", error);
                alert("❌ Hệ thống gặp sự cố kết nối, vui lòng thử lại sau!");
            } finally {
                setSubmitting(loginForm, false);
            }
        });
    }

    // ==========================================
    // 2. XỬ LÝ ĐĂNG KÝ
    // ==========================================
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            const ho_ten = document.getElementById("ho_ten").value.trim();
            const email = document.getElementById("reg_email").value.trim();
            const so_dien_thoai = document.getElementById("so_dien_thoai").value.trim();
            const password = document.getElementById("reg_password").value;

            if (password.length < 6) {
                alert("❌ Mật khẩu phải có độ dài từ 6 ký tự trở lên!");
                return;
            }

            const data = { ho_ten, email, so_dien_thoai, password };

            try {
                setSubmitting(registerForm, true);
                const res = await apiFetch("/auth/register", { 
                    method: "POST", 
                    body: data 
                });

                if (res && res.success) {
                    alert("🎉 Khởi tạo tài khoản thành công! Hãy đăng nhập.");
                    window.location.href = "login.html";
                } else {
                    alert(`❌ Lỗi đăng ký: ${res?.message || "Không thể đăng ký thành viên."}`);
                }
            } catch (error) {
                console.error("Register Error:", error);
                alert("❌ Không thể kết nối tới máy chủ đăng ký!");
            } finally {
                setSubmitting(registerForm, false);
            }
        });
    }

    // ==========================================
    // 3. XỬ LÝ YÊU CẦU GỬI OTP (QUÊN MẬT KHẨU)
    // ==========================================
    const forgotForm = document.getElementById("forgotForm");
    if (forgotForm) {
        forgotForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = document.getElementById("forgot_email").value.trim();

            if (!email) {
                alert("❌ Vui lòng nhập Email để nhận mã OTP!");
                return;
            }

            try {
                setSubmitting(forgotForm, true);
                const res = await apiFetch("/auth/forgot-password", {
                    method: "POST",
                    body: { email }
                });

                if (res && res.success) {
                    alert("📩 Mã OTP khôi phục đã được gửi vào Email của bạn. Vui lòng kiểm tra hộp thư!");
                    sessionStorage.setItem("reset_email", email);
                    window.location.href = "reset-password.html";
                } else {
                    alert(`❌ Lỗi: ${res?.message || "Email không tồn tại trong hệ thống."}`);
                }
            } catch (error) {
                console.error("Forgot Password Error:", error);
                alert("❌ Gửi yêu cầu thất bại do lỗi đường truyền.");
            } finally {
                setSubmitting(forgotForm, false);
            }
        });
    }

    // ==========================================
    // 4. XỬ LÝ NHẬP OTP & ĐẶT LẠI MẬT KHẨU MỚI
    // ==========================================
    const resetForm = document.getElementById("resetForm");
    if (resetForm) {
        resetForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            const email = sessionStorage.getItem("reset_email");
            const otp = document.getElementById("otp_code").value.trim(); 
            const newPassword = document.getElementById("new_password").value; 
            const confirmPassword = document.getElementById("confirm_password").value; 

            if (!email) {
                alert("❌ Phiên làm việc lỗi hoặc đã hết hạn. Vui lòng thực hiện lại bước nhập Email!");
                window.location.href = "forgot-password.html";
                return;
            }

            if (!otp) {
                alert("❌ Vui lòng nhập mã OTP đã nhận.");
                return;
            }

            if (newPassword.length < 6) {
                alert("❌ Mật khẩu mới phải từ 6 ký tự trở lên!");
                return;
            }

            if (newPassword !== confirmPassword) {
                alert("❌ Mật khẩu xác nhận không khớp!");
                return;
            }

            try {
                setSubmitting(resetForm, true);
                const res = await apiFetch("/auth/reset-password", {
                    method: "POST",
                    body: { email, otp, newPassword }
                });

                if (res && res.success) {
                    alert("🎉 Đổi mật khẩu thành công! Hãy đăng nhập bằng mật khẩu mới.");
                    sessionStorage.removeItem("reset_email");
                    window.location.href = "login.html";
                } else {
                    alert(`❌ Đổi mật khẩu thất bại: ${res?.message || "Mã OTP không hợp lệ hoặc đã hết hạn."}`);
                }
            } catch (error) {
                console.error("Reset Password Error:", error);
                alert("❌ Không thể xác thực đặt lại mật khẩu do lỗi hệ thống.");
            } finally {
                setSubmitting(resetForm, false);
            }
        });
    }
});