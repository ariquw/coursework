document.addEventListener('DOMContentLoaded', function() {
    const linePathPurpose = document.querySelector('.decorative-line svg path');
    const purposeSection = document.querySelector('.purpose-block');
    
    const linePathAction = document.querySelector('.decorative-line-action svg path');
    const actionSection = document.querySelector('.action-block');

    if (linePathPurpose) {
        const length = linePathPurpose.getTotalLength();
        linePathPurpose.style.strokeDasharray = length;
        linePathPurpose.style.strokeDashoffset = length;
        linePathPurpose.style.animation = 'none';
    }

    if (linePathAction) {
        const length = linePathAction.getTotalLength();
        linePathAction.style.strokeDasharray = length;
        linePathAction.style.strokeDashoffset = length;
        linePathAction.style.animation = 'none';
    }

    const observerPurpose = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (linePathPurpose) {
                    linePathPurpose.style.animation = 'drawLine 2.5s ease-out forwards';
                }
                observerPurpose.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5 
    });

    const observerAction = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (linePathAction) {
                    linePathAction.style.animation = 'drawLine 2.5s ease-out forwards';
                }
                observerAction.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.3
    });

    if (purposeSection) observerPurpose.observe(purposeSection);
    if (actionSection) observerAction.observe(actionSection);
});