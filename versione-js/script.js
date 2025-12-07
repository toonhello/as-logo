(function() {
    const logoContainer = document.getElementById('logo-container');
    const logoMiddle = document.querySelector('.logo-middle');
    const footer = document.querySelector('footer');
    const logoStart = document.querySelector('.logo-start');
    const logoEnd = document.querySelector('.logo-end');

    if (!logoContainer || !logoMiddle || !footer || !logoStart || !logoEnd) {
        console.error('AS-Logo Script: Required DOM elements are missing.');
        return; // Stop execution if elements are not found
    }

    let startWidth, endWidth, minMiddleWidth, maxMiddleWidth;
    let ticking = false;

    function getCssVariable(variable) {
        return parseFloat(getComputedStyle(document.documentElement).getPropertyValue(variable));
    }

    function isDesktop() {
        return window.innerWidth >= 992;
    }

    function updateDimensions() {
        startWidth = logoStart.offsetWidth;
        endWidth = logoEnd.offsetWidth;
        
        const cssVar = isDesktop() ? '--logo-middle-lg-width' : '--logo-middle-xs-width';
        minMiddleWidth = getCssVariable(cssVar) || (isDesktop() ? 9 : 5);
        
        // Recalculate max width based on the new dimensions
        maxMiddleWidth = logoContainer.offsetWidth - (startWidth + endWidth);
    }

    function updateLogo() {
        const footerRect = footer.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const progress = (viewportHeight - footerRect.top) / footerRect.height;
        const clampedProgress = Math.max(0, Math.min(1, progress));

        // Ensure progress is a valid number to prevent errors
        if (isNaN(clampedProgress)) {
            return;
        }

        const middleWidth = minMiddleWidth + (maxMiddleWidth - minMiddleWidth) * clampedProgress;
        logoMiddle.style.width = middleWidth + 'px';
        
        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            ticking = true;
            window.requestAnimationFrame(updateLogo);
        }
    }

    function onResize() {
        // On resize, we need to recalculate dimensions and then update the logo
        updateDimensions();
        requestTick();
    }

    // Initial setup
    updateDimensions();
    requestTick();

    // Add event listeners in a robust way
    window.addEventListener('scroll', requestTick, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });

})();
