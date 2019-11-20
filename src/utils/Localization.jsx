import LocalizedStrings from 'react-localization';

let localizationStrings = new LocalizedStrings({
    en: {
        //auth page text
        emailLabel: "Email address",
        emailPlaceholder: "Enter email",
        passwordLabel: "Password",
        passwordPlaceholder: "Password",
        login: "Login",
        signUp: "Sign up",
        forgotPassword: "Forgot your password?",
        //nav bar text
        home: "Home ",
        facilityUpload: "Facility Upload",
        searchProviderName: "Search provider name",
        searchZipcode: "Search zipcode",
        hideLabel: "Hide",
        showLabel: "Show",
        languagesLabel: "Languages",
        agesLabel: "Ages",
        insuranceLabel: "Insurance",
        serviceTypeLabel: "Service Type",
        specializationsLabel: "Specializations",
        therapyTypeLabel: "Therapy Types",


    },
    es: {
        //auth page text
        emailLabel: "Dirección de correo electrónico",
        emailPlaceholder: "Ingrese correo electrónico",
        passwordLabel: "Contraseña",
        passwordPlaceholder: "Contraseña",
        login: "Iniciar sesión",
        signUp: "Regístrate",
        forgotPassword: "¿Olvidar la contraseña?",
        //nav bar text
        home: "Casa",
        facilityUpload: "Subida de instalaciones",
    }
});

export default localizationStrings;
