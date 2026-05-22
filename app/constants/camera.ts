export const CAMERA_POSITION: [number, number, number] = [10, 4, 7]
export const ORBIT_TARGET: [number, number, number] = [0, 1, 0]

/** Camera Y at the closest allowed zoom (matches `ORBIT_MIN_DISTANCE`). */
export const CAMERA_MIN_HEIGHT = 1.5

/** Spherical coordinates of CAMERA_POSITION around ORBIT_TARGET. */
const SPHERICAL = (() => {
  const [x, y, z] = CAMERA_POSITION
  const [tx, ty, tz] = ORBIT_TARGET
  const radius = Math.hypot(x - tx, y - ty, z - tz)
  return {
    radius,
    polar: Math.acos((y - ty) / radius),
    cosPolar: (y - ty) / radius,
  }
})()

/** OrbitControls polar angle (locked equal to min/max). */
export const ORBIT_POLAR_ANGLE = SPHERICAL.polar

/**
 * Minimum dolly distance. Derived from CAMERA_MIN_HEIGHT and the locked polar
 * angle so that y = CAMERA_MIN_HEIGHT at full zoom-in.
 */
export const ORBIT_MIN_DISTANCE
  = (CAMERA_MIN_HEIGHT - ORBIT_TARGET[1]) / SPHERICAL.cosPolar

/** Maximum dolly distance: 1.5x the default radius. */
export const ORBIT_MAX_DISTANCE = SPHERICAL.radius * 1.5
