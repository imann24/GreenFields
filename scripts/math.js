/**
 * @author: Isaiah Mann
 * @desc: Simple mathematical functions
 */

Math.lerp = function (start, end, time) {
     return start + time * (end - start);
}
