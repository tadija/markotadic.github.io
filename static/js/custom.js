function copyToClipboard(id) {
    let code = document.getElementById('code-' + id).innerText;
    let button = document.getElementById('button-' + id);
    let title = document.getElementById('title-' + id);

    // store initial values
    let titleText = title.innerText;
    let buttonHTML = button.innerHTML;

    button.disabled = true

    navigator.clipboard.writeText(code)
        .then(function () {
            // set success icon and title
            button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>'
            button.classList.add('success');
            title.innerText = 'copied!'
        })
        .catch(function (err) {
            // set error icon and title
            button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>'
            button.classList.add('error');
            title.innerText = 'error!'
        })
        .finally(function () {
            // revert initial values + remove classes
            setTimeout(function () {
                button.disabled = false;
                button.innerHTML = buttonHTML;
                button.classList.remove('success', 'error');
                title.innerText = titleText;
            }, 1600);
        });
}

function configureCodeBlocks() {
    let codeBlocks = document.querySelectorAll('[id^="code-"]');
    console.log("found " + codeBlocks.length + " code blocks");

    codeBlocks.forEach((code) => {
        let buttonID = "button-" + code.id.split("-").pop();
        let button = document.getElementById(buttonID);

        let hideButton = function() { button.style.display = "none"; }
        let showButton = function() { button.style.display = "block"; }

        if ("onscrollend" in window) {
            code.onscroll = hideButton;
            code.onscrollend = showButton;
        } else {
            code.onscroll = event => {
                hideButton();
                clearTimeout(window.scrollEndTimer);
                window.scrollEndTimer = setTimeout(showButton, 1600);
            }
        }
    });
}
