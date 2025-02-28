function animateElement(element, animationProps) {
    anime({
        targets: element,
        ...animationProps
    });
}
