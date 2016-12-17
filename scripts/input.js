function Input () {}

Input.getMousePosition = function (canvas, event) {
     var rect = canvas.getBoundingClientRect();
     if (rect) {
            return {
              x: event.clientX - rect.left,
              y: event.clientY - rect.top
            };
     } else {
           return {
             x: event.clientX,
             y: event.clientY
           };
     }
}
