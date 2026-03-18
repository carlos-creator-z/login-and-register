document.addEventListener('DOMContentLoaded', function () {

    // ============================================================
    //  Códigos de profesor válidos (simulación sin base de datos)
    // ============================================================
    const CODIGOS_VALIDOS = ['PROF-2024', 'DOC-001', 'MAESTRO-99', 'EDU-2025'];

    // ============================================================
    //  Referencias al DOM
    // ============================================================
    const loginSection    = document.getElementById('login');
    const registerSection = document.getElementById('register');
    const goToRegister    = document.getElementById('goToRegister');
    const goToLogin       = document.getElementById('goToLogin');
    const cbLogin         = document.getElementById('isTeacher-login');
    const cbRegister      = document.getElementById('isTeacher-register');
    const loginForm       = document.getElementById('loginForm');
    const registerForm    = document.getElementById('registerForm');

    // ============================================================
    //  Toggle Login ↔ Registro
    // ============================================================
    function toggleForms(e) {
        e.preventDefault();
        loginSection.classList.toggle('active');
        registerSection.classList.toggle('active');
    }
    goToRegister.addEventListener('click', toggleForms);
    goToLogin.addEventListener('click', toggleForms);

    // ============================================================
    //  Mostrar / ocultar campo código docente
    // ============================================================
    function toggleTeacherField(formId) {
        const checkbox = document.getElementById('isTeacher-' + formId);
        const field    = document.getElementById('teacher-field-' + formId);
        const input    = field.querySelector('input[type="text"]');

        if (checkbox.checked) {
            field.removeAttribute('hidden');
            requestAnimationFrame(() => field.classList.add('visible'));
            input.setAttribute('required', 'true');
        } else {
            field.classList.remove('visible');
            input.removeAttribute('required');
            input.value = '';
            clearCodeFeedback(formId);
            field.addEventListener('transitionend', function handler() {
                if (!checkbox.checked) field.setAttribute('hidden', '');
                field.removeEventListener('transitionend', handler);
            });
        }
    }
    cbLogin.addEventListener('change',    () => toggleTeacherField('login'));
    cbRegister.addEventListener('change', () => toggleTeacherField('register'));

    // ============================================================
    //  Validación visual en tiempo real del código docente
    // ============================================================
    function setupCodeValidation(formId) {
        const input   = document.getElementById('teacher-code-' + formId);
        const hint    = document.getElementById('code-hint-' + formId);

        input.addEventListener('input', function () {
            const val = this.value.trim().toUpperCase();

            if (val === '') {
                setCodeState(input, hint, 'idle', 'Este código es asignado por la institución educativa.');
                return;
            }

            if (CODIGOS_VALIDOS.includes(val)) {
                setCodeState(input, hint, 'valid', '✅ Código de profesor verificado correctamente.');
            } else {
                setCodeState(input, hint, 'invalid', '❌ Código no reconocido. Verifica e intenta de nuevo.');
            }
        });
    }

    function setCodeState(input, hint, state, message) {
        input.classList.remove('code-valid', 'code-invalid');
        hint.classList.remove('hint-valid', 'hint-invalid');

        if (state === 'valid') {
            input.classList.add('code-valid');
            hint.classList.add('hint-valid');
        } else if (state === 'invalid') {
            input.classList.add('code-invalid');
            hint.classList.add('hint-invalid');
        }
        hint.textContent = message;
    }

    function clearCodeFeedback(formId) {
        const input = document.getElementById('teacher-code-' + formId);
        const hint  = document.getElementById('code-hint-' + formId);
        if (!input || !hint) return;
        input.classList.remove('code-valid', 'code-invalid');
        hint.classList.remove('hint-valid', 'hint-invalid');
        hint.textContent = 'Este código es asignado por la institución educativa.';
    }

    setupCodeValidation('login');
    setupCodeValidation('register');

    // ============================================================
    //  Reset bloque docente tras submit
    // ============================================================
    function resetTeacherField(formId) {
        const checkbox = document.getElementById('isTeacher-' + formId);
        const field    = document.getElementById('teacher-field-' + formId);
        const input    = field.querySelector('input[type="text"]');
        checkbox.checked = false;
        field.classList.remove('visible');
        input.value = '';
        field.setAttribute('hidden', '');
        clearCodeFeedback(formId);
    }

    // ============================================================
    //  Submit: LOGIN
    // ============================================================
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const email       = document.getElementById('email-login').value.trim();
        const password    = document.getElementById('password-login').value;
        const isTeacher   = cbLogin.checked;
        const teacherCode = document.getElementById('teacher-code-login').value.trim().toUpperCase();

        if (isTeacher) {
            if (teacherCode === '') {
                alert('❌ Por favor ingresa tu código de profesor.');
                return;
            }
            if (!CODIGOS_VALIDOS.includes(teacherCode)) {
                alert('❌ Código de profesor no válido. Verifica el código e intenta de nuevo.');
                return;
            }
        }

        const role = isTeacher ? 'Profesor' : 'Estudiante';
        alert('¡Bienvenido ' + role + '! Iniciaste sesión como: ' + email);

        this.reset();
        resetTeacherField('login');
    });

    // ============================================================
    //  Submit: REGISTRO
    // ============================================================
    registerForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const name        = document.getElementById('name-register').value.trim();
        const email       = document.getElementById('email-register').value.trim();
        const password    = document.getElementById('password-register').value;
        const confirm     = document.getElementById('confirm-password').value;
        const isTeacher   = cbRegister.checked;
        const teacherCode = document.getElementById('teacher-code-register').value.trim().toUpperCase();

        if (password !== confirm) {
            alert('❌ Las contraseñas no coinciden');
            return;
        }
        if (password.length < 6) {
            alert('❌ La contraseña debe tener al menos 6 caracteres');
            return;
        }
        if (isTeacher) {
            if (teacherCode === '') {
                alert('❌ Por favor ingresa tu código de profesor.');
                return;
            }
            if (!CODIGOS_VALIDOS.includes(teacherCode)) {
                alert('❌ Código de profesor no válido. Verifica el código e intenta de nuevo.');
                return;
            }
        }

        const role = isTeacher ? 'Profesor' : 'Estudiante';
        alert('✅ ¡Cuenta creada exitosamente!\nBienvenido ' + role + ': ' + name);

        this.reset();
        resetTeacherField('register');
        loginSection.classList.add('active');
        registerSection.classList.remove('active');
    });

}); // fin DOMContentLoaded