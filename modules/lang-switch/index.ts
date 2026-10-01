/**
 * Public entry for the lang-switch module.
 *
 * The switcher exists once, here. Routes mount `LangSwitch`; they never carry
 * their own copy of the markup. Picking a locale records the choice in the
 * `locale` cookie the root redirect honours.
 */
export { LangSwitch } from "./lang-switch";
