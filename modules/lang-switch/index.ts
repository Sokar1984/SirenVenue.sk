/**
 * Public entry for the lang-switch module.
 *
 * The switcher exists once, here. Routes mount `LangSwitch`; they never carry
 * their own copy of the markup. The header control shows the current locale as
 * a drawn SVG flag plus its label, and opens a keyboard-navigable list of every
 * enabled locale. Picking one records the choice in the `locale` cookie the
 * root redirect honours and opens the same path in that locale.
 */
export { LangSwitch } from "./lang-switch";
