(function() {
    var gtagScript = document.createElement('script');
    gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=SEU_ID_DE_RASTREAMENTO';
    gtagScript.async = true;
    document.head.appendChild(gtagScript);

    gtagScript.onload = function() {
        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        gtag('js', new Date());
        gtag('config', 'G-F4VKKT534W');
    };
})();
