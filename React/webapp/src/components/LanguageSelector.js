import React from 'react';
import { useTranslation } from 'react-i18next';
import { ButtonGroup, Button } from 'react-bootstrap';

const LanguageSelector = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang); // Change the language using i18n's changeLanguage method
    };

    return (
        <ButtonGroup aria-label="Language selector">
            <Button 
                variant={i18n.language === 'en' ? 'primary' : 'outline-primary'}
                onClick={() => changeLanguage('en')}
            >
                English
            </Button>
            <Button 
                variant={i18n.language === 'fr' ? 'primary' : 'outline-primary'}
                onClick={() => changeLanguage('fr')}
            >
                Français
            </Button>
        </ButtonGroup>
    );
};

export default LanguageSelector;