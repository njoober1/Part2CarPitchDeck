import React from 'react';

interface CookieInvestorPopupProps {
  isVisible: boolean;
  onAccept: () => void;
  content: {
    title: string;
    message: string;
    accept: string;
  };
}

const CookieInvestorPopup: React.FC<CookieInvestorPopupProps> = ({ isVisible, onAccept, content }) => {
  return (
    <div
      className={`fixed bottom-0 right-0 m-4 md:m-8 max-w-md w-full transition-all duration-500 ease-in-out z-50 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}
      role="dialog"
      aria-live="polite"
      aria-label="Investor Confirmation and Cookie Consent"
      hidden={!isVisible}
    >
      <div className="glassmorphism rounded-xl p-6 shadow-2xl">
        <div className="flex flex-col">
          <h3 className="text-lg font-bold text-white mb-2">{content.title}</h3>
          <p className="text-slate-300 text-sm mb-4 leading-relaxed">
            {content.message}
          </p>
          <button
            onClick={onAccept}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-transform duration-200 hover:scale-105 text-md"
            aria-label={content.accept}
          >
            {content.accept}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieInvestorPopup;
