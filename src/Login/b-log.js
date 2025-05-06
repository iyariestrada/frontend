const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    upperCase: false,
    lowerCase: false,
    number: false,
    specialChar: false
  });

  // Validación en tiempo real de la contraseña
  useEffect(() => {
    if (registerForm.password) {
      const newStrength = {
        length: registerForm.password.length >= 8,
        upperCase: /[A-Z]/.test(registerForm.password),
        lowerCase: /[a-z]/.test(registerForm.password),
        number: /\d/.test(registerForm.password),
        specialChar: /[^\w\s]/.test(registerForm.password)
      };
      setPasswordStrength(newStrength);
    } else {
      setPasswordStrength({
        length: false,
        upperCase: false,
        lowerCase: false,
        number: false,
        specialChar: false
      });
    }
  }, [registerForm.password]);

  // Función de validación mejorada
  const validatePassword = (password) => {
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[^\w\s]/.test(password);
    
    return hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!phoneValid) {
      newErrors.num_tel = "Verifique su número de teléfono primero";
    }
    if (!registerForm.name.trim()) {
      newErrors.name = "Nombre es requerido";
    }
    if (!registerForm.email.trim()) {
      newErrors.email = "Email es requerido";
    } else if (!/\S+@\S+\.\S+/.test(registerForm.email)) {
      newErrors.email = "Email no válido";
    }
    
    // Validación detallada de contraseña
    if (!registerForm.password) {
      newErrors.password = "Contraseña es requerida";
    } else {
      const passwordValid = validatePassword(registerForm.password);
      if (!passwordValid) {
        newErrors.password = "La contraseña no cumple todos los requisitos";
      }
    }
    
    if (registerForm.password !== registerForm.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }