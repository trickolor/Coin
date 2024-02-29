import { el } from "redom";

window.addEventListener('mouseup', () => {
    document.querySelectorAll('.drag--available').forEach((e) => {
        e.classList.remove('drag--available');
    })
})

export function customize(elements) {
    let targetElement = null;

    elements.forEach(element => {
        const drag = el('.drag');
        element.append(drag);

        element.addEventListener('mouseover', () => {
            const thisDrag = element.querySelector('.drag');
            thisDrag.classList.add('drag--active');
        })

        element.addEventListener('mouseout', () => {
            const thisDrag = element.querySelector('.drag');
            thisDrag.classList.remove('drag--active');
        })

        drag.addEventListener('click', () => {
            const parent = drag.parentElement;
            parent.classList.add('drag--selected');
            drag.classList.add('drag--force-hidden');
            parent.draggable = true;
        });

        const dragRemove = () => {
            const thisDrag = element.querySelector('.drag');
            element.classList.remove('drag--selected');
            thisDrag.classList.remove('drag--force-hidden');
            element.draggable = false;
        }

        element.addEventListener('mouseout', () => {
            window.addEventListener('click', dragRemove);
        })

        element.addEventListener('mouseover', () => {
            window.removeEventListener('click', dragRemove);
        })

        element.addEventListener('drag', () => {
            elements.forEach((i) => {
                if (i !== element) {
                    i.classList.add('drag--available')
                }
            });
        });

        element.addEventListener('dragover', (e) => {
            e.preventDefault();
            if (e.target !== e.currentTarget) {
                targetElement = e.currentTarget;
            }
        });

        element.addEventListener('dragend', (e) => {
            if (targetElement && e.target !== targetElement) {
                let refElementDragged = e.target.nextSibling;
                let refElementTarget = targetElement.nextSibling;

                e.target.parentNode.insertBefore(targetElement, refElementDragged);
                targetElement.parentNode.insertBefore(e.target, refElementTarget);

                elements.forEach((i) => {
                    i.classList.remove('drag--available');
                })

                targetElement = null;
                e.target.classList.remove('drag--selected');
                e.target.draggable = false;
                e.target.querySelector('.drag').classList.remove('drag--force-hidden');
            }
        });
    });
}