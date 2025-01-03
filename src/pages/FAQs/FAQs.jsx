import { useState } from 'react';
import PropTypes from 'prop-types';
import SectionHeader from '../../components/SectionHeader/SectionHeader';

const FAQItem = ({ question, answer, isOpen, onClick }) => (
    <div className="faq-item">
        <button className="faq-question" onClick={onClick}>
            {question}
            <span className="faq-icon-container">
                <i className={`fa-solid fa-up-long  ${isOpen ? 'fa-spin-pulse' : 'fa-beat'}`}></i>
            </span>
        </button>
        {isOpen && <div className="faq-answer">{answer}</div>}
    </div>
);

const FAQs = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const faqData = [
        {
            question: 'What is eSIM activation, and how does it benefit my business?',
            answer: 'eSIM activation provides seamless carrier switching and instant activation, improving connectivity and offering flexibility for mobile services.',
        },
        {
            question: 'How can Bulk SMS Marketing help my company?',
            answer: 'Bulk SMS Marketing allows businesses to instantly reach a large customer base, offering a cost-effective and efficient way to engage and communicate with customers.',
        },
        {
            question: 'What is the difference between Custom Software Development and SaaS?',
            answer: 'Custom Software Development offers tailored solutions to meet specific business needs, while SaaS provides on-demand tools and services without the need for infrastructure investment.',
        },
        {
            question: 'Why should I consider PCG MS Marketing Service?',
            answer: 'PCG MS Marketing Service helps businesses engage customers more effectively using WhatsApp Business API for marketing and support.',
        },
        {
            question: 'What type of technical consultation does Procom offer?',
            answer: 'Procom provides expert guidance to optimize system performance, ensure scalability, and provide tailored strategies for growth and efficiency.',
        },
    ];

    return (
        <section id="faqs" className="faqs">
            <div className="faqs__container">
                <SectionHeader title="FAQs" isColored={true} />
                <div className="faqs__content">
                    <div className="faqs-list">
                        {faqData.map((faq, index) => (
                            <FAQItem
                                key={index}
                                question={faq.question}
                                answer={faq.answer}
                                isOpen={openIndex === index}
                                onClick={() => toggleFAQ(index)}
                            />
                        ))}
                    </div>
                    <div className="faqs-animation">
                        <img src="https://img.freepik.com/foto-gratis/gafas-escritorio-oficina-repleto-papeles-blanco-negro_1098-50.jpg?t=st=1735907797~exp=1735911397~hmac=e863c53c466818444f607cee1365e8d81027f241cf15d3400006b98b00ca9ae9&w=996" alt="faq animation" className="faqs-image" />
                    </div>
                </div>
            </div>
        </section>
    );
};

FAQItem.propTypes = {
    question: PropTypes.string.isRequired,
    answer: PropTypes.string.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
};

export default FAQs;
