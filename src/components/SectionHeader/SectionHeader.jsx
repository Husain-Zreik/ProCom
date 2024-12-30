import PropTypes from 'prop-types';

const SectionHeader = ({ title, subtitle }) => {
    return (
        <div className="section-header">
            <div className="section-header-right">
                <i style={{ color: '#c54a5c' }} className="fa-solid fa-circle-notch fa-spin fa-2xl"></i>
                <div className='section-header-content'>
                    <h1 className="section-title">{title}</h1>
                    {subtitle && <p className="section-subtitle">{subtitle}</p>}
                </div>
            </div>
            <div className="section-icons">
                <div style={{ backgroundColor: '#bd2b52' }} className="icon-shape">
                    <i className="fa-solid fa-signature fa-fade"></i>
                </div>
                <div className="icon-shape">
                    <i className="fa-solid fa-wave-square fa-flip"></i>
                </div>
                <div style={{ backgroundColor: '#131313' }} className="icon-shape">
                    <i className="fa-brands fa-think-peaks fa-fade"></i>
                </div>
            </div>
        </div>
    );
};

SectionHeader.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string, // Optional subtitle prop
};

export default SectionHeader;
