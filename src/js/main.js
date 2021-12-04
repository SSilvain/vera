window.onload = function () {
	// fsLightboxInstances['first-lightbox'].open(0);
	
	
	const phoneShow = () => {document.querySelector('.header__phone').classList.add('phone--active')}
	const phoneHide = () => {document.querySelector('.header__phone').classList.remove('phone--active')}
	
	document.getElementById('phone__icon').onclick = phoneShow
	document.getElementById('phone__close').onclick = phoneHide
}
