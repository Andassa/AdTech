/**
 * Combine plusieurs classes CSS en une seule chaîne.
 * Ignore les valeurs null, undefined, false ou vides.
 *
 * @param {...(string|undefined|null|boolean)} classes - Les classes à combiner
 * @returns {string} Chaîne de classes CSS combinées
 *
 * @example
 * cn("btn", isActive && "btn-active") // "btn btn-active"
 */
export const cn = (...classes) => {
    return classes.filter(Boolean).join(" ");
  };
  
  export default cn;
  