import React from 'react'
import { NavLink } from 'react-router-dom'
import ReactTooltip from "react-tooltip";
import Social from "./Social";
import Help from "./Help";
import Verify from "./Verify";

class Menu extends React.Component {

    render() {
        const {t, type, smShow, hideSmMenu} = this.props;
        const cls = smShow ? '' : 'slide-none ';
        return(
                <>
                    {type === 'min' && <ReactTooltip /> }
                    <div id="lss" className={cls + "menu-body animated flex-1 flex-column"} >
                        <div className="flex-1">
                            <ul className="nav">
                                <li className={'nav-item'} data-tip={ type === 'min' ? 'Crash' : "" }>
                                    <NavLink exact activeClassName="active" className="nav-link-x" to={'/'} onClick={hideSmMenu}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 421.6c-18.1 0-33.2-6.8-42.9-10.9-5.4-2.3-11.3 1.8-10.9 7.6l3.5 51c.2 3.1 3.8 4.7 6.3 2.8l14.5-11c1.8-1.4 4.5-.9 5.7 1l20.5 32.1c1.5 2.4 5.1 2.4 6.6 0l20.5-32.1c1.2-1.9 3.9-2.4 5.7-1l14.5 11c2.5 1.9 6.1.3 6.3-2.8l3.5-51c.4-5.8-5.5-10-10.9-7.6-9.8 4.1-24.8 10.9-42.9 10.9z"></path><path d="M397.7 293.1l-48-49.1c0-158-93.2-228-93.2-228s-94.1 70-94.1 228l-48 49.1c-1.8 1.8-2.6 4.5-2.2 7.1L130.6 412c.9 5.7 7.1 8.5 11.8 5.4l67.1-45.4s20.7 20 47.1 20c26.4 0 46.1-20 46.1-20l67.1 45.4c4.6 3.1 10.8.3 11.8-5.4l18.5-111.9c.2-2.6-.6-5.2-2.4-7zM256.5 192c-17 0-30.7-14.3-30.7-32s13.8-32 30.7-32c17 0 30.7 14.3 30.7 32s-13.7 32-30.7 32z"></path></svg>
                                        <span className="menu-name">Crash</span>
                                     </NavLink>
                                </li>
                                <li className={'nav-item'} data-tip={ type === 'min' ? 'Leaderboard' : "" }>
                                    <NavLink activeClassName="active" className="nav-link-x" to={'/leaderboard'} onClick={hideSmMenu}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                            <path d="M256 372.686L380.83 448l-33.021-142.066L458 210.409l-145.267-12.475L256 64l-56.743 133.934L54 210.409l110.192 95.525L131.161 448z"></path>
                                        </svg>
                                        <span className="menu-name">Leaderboard</span>
                                     </NavLink>
                                </li>
                                <li className={'nav-item'} data-tip={ type === 'min' ? t('affiliate') : "" } onClick={hideSmMenu}>
                                    <NavLink activeClassName="active" className="nav-link-x" to={'/affiliate'}>
                                       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 176c-44.004 0-80.001 36-80.001 80 0 44.004 35.997 80 80.001 80 44.005 0 79.999-35.996 79.999-80 0-44-35.994-80-79.999-80zm190.938 58.667c-9.605-88.531-81.074-160-169.605-169.599V32h-42.666v33.067c-88.531 9.599-160 81.068-169.604 169.599H32v42.667h33.062c9.604 88.531 81.072 160 169.604 169.604V480h42.666v-33.062c88.531-9.604 160-81.073 169.605-169.604H480v-42.667h-33.062zM256 405.333c-82.137 0-149.334-67.198-149.334-149.333 0-82.136 67.197-149.333 149.334-149.333 82.135 0 149.332 67.198 149.332 149.333S338.135 405.333 256 405.333z"></path></svg>
                                        <span className="menu-name">{t('affiliate')}</span>
                                     </NavLink>
                                </li>
                                <li className={'nav-item'} data-tip={ type === 'min' ? t('privacy_policy') : "" }>
                                    <NavLink activeClassName="active" className="nav-link-x" to={'/privacy'} onClick={hideSmMenu}>
                                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                            <path d="M168.531 215.469l-29.864 29.864 96 96L448 128l-29.864-29.864-183.469 182.395-66.136-65.062zm236.802 189.864H106.667V106.667H320V64H106.667C83.198 64 64 83.198 64 106.667v298.666C64 428.802 83.198 448 106.667 448h298.666C428.802 448 448 428.802 448 405.333V234.667h-42.667v170.666z"></path>
                                         </svg>
                                        <span className={'cpt menu-name'}>Privacy Policy</span>
                                    </NavLink>
                                </li>
                                <li className={'nav-item'} data-tip={ type === 'min' ? t('user_agreement') : "" }>
                                     <NavLink activeClassName="active" className="nav-link-x" to={'/terms'} onClick={hideSmMenu}>
                                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M428 269c-21.5 0-40.6 13.1-48.4 33h-41.2L307 221.3c-2.7-8.2-10.3-13.7-19-13.7h-.4c-8.8.2-16.4 6-18.8 14.5l-33.6 135.4-55.5-291.8C178 55.6 169.6 48 160 48c-9.5 0-16.9 6.2-19.4 16.2L90.3 302H32v40h74c9.2 0 17.2-6.2 19.4-15.2l30.7-160.6 54.1 282.1c1.5 8.8 8.9 15.1 18.6 15.7h1.2c9.3 0 16.9-5.3 19.2-13.5l40.2-162.9 15.5 40.7c2.7 8.2 10.3 13.7 19 13.7h56.4c8.3 19 27.1 31 47.6 31 13.9 0 26.9-5.6 36.8-15.8 9.8-10.1 15.2-23.3 15.2-37.2.1-28.6-22.7-51-51.9-51z"></path></svg>
                                         <span className={'cpt menu-name'}>User Agreement</span>
                                     </NavLink>
                                </li>
                                <li className="nav-item" data-tip={ type === 'min' ? t('verify_result') : "" }>
                                  <Verify t={t} />
                                </li>
                            </ul>
                        </div>
                        <div>
                            <div className="text-center">
                                <Help type={type} />
                            </div>
                            <ul className="nav left-bottom">
                                {type !== 'min' &&
                                    <>
                                        <hr className="side-border mx-0 mt-0" />
                                        <li className="w-100 text-center">
                                            <Social t={t}/>
                                        </li>
                                    </>
                                }
                            </ul>
                        </div>
                    </div>
            </>
        );
    }
}

export default Menu;