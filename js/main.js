"use strict";

window.onload = function(){
	new Slider('.offers_slider',{
		navigationArrows: true,
		navigationCounter: true,
	});
	new Slider('.about_slider',{
		navigationArrows: true,
		navigationCounter: true,
	});
	new Slider('.tasks_slider',{
		navigationArrows: true,
		multiDisplay: {
			mobile: 1,
			touch: 3,
			desktop: 5
		},
		slideClickRewind: true,
		emulateDotters: '#tasks_content',
	});
	new Slider('.turn_slider',{
		navigationArrows: true,
		navigationCounter: true,
		multiDisplay: {
			mobile: 2,
			touch: 3,
			desktop: 3,
			multiShift: true,
			marginRight: {
				mobile: '16',
				touch: '40',
				desktop: '40',
			}
		},
		multiShift: true,
	});
	new Slider('.event_slider',{
		navigationArrows: true,
	});
	new Slider('.prod_slider',{
		navigationArrows: true,
		navigationCounter: true,
		multiDisplay: {
			mobile: 2,
			touch: 3,
			desktop: 3,
			multiShift: true,
			marginRight: {
				mobile: '16',
				touch: '40',
				desktop: '40',
			}
		},
	});


	document.addEventListener('click', clickItemHandler);
	document.addEventListener('click', startVideo);


	document.addEventListener('keydown', function(event){
		if(event.target.tagName.toLowerCase() == 'input' && event.target.type == 'tel'){
		    let keycode = event.keyCode;
		    if ((44 < keycode && keycode < 58)||(keycode == 187)||(keycode == 8)||(keycode == 37)||(keycode == 39)){} else {
		    	event.preventDefault();
		    };			
		};
	});


	new News('.news_block');
};


class Slider{
	constructor(slider_container, params){
		document.querySelectorAll(slider_container).forEach((container) => {
			this.container = container;
			this.params = params;
			this.createSliderBox();
			if(this.params.navigationDotters) this.createSliderNavigationDotters();
			this.prepare();
			if(this.params.navigationArrows) this.createSliderNavigationArrows();
			if(this.params.navigationCounter) this.createSliderNavigationCounter();
			if(this.params.slideClickRewind) this.prepareSlidesOnclick();
			

			this.box.addEventListener('mousedown',this.mouseFlip.bind(this));
		    this.box.addEventListener("touchstart", this.touchFlip.bind(this));

		    window.addEventListener('resize', this.prepare.bind(this));
		});
	}

	prepare(){
		this.activeSlider = 0;
		
		this.slideOnScreen = 1;
		if(this.params.multiDisplay){
			let w = document.body.offsetWidth;
			if(w>0 && w<=700){
				this.slideOnScreen = this.params.multiDisplay.mobile;
			} else if(w>700 && w<=1100){
				this.slideOnScreen = this.params.multiDisplay.touch;
			} else {
				this.slideOnScreen = this.params.multiDisplay.desktop;
			}
		}

		this.extendSlides();
		this.slideAll();
	}

	prepareSlidesOnclick(){
		this.sliders.forEach((slide)=>{

			slide.addEventListener('click', func.bind(this));

			function func(){
				console.log(this);
				this.sliders.forEach(slide => slide.classList.remove('active'));
				slide.classList.add('active');
				this.slideAll();
			}
		})
	}

	createSliderBox(){
		this.box = document.createElement('div');
		this.box.classList = ('slider_box');

		this.sliders = [].slice.call(this.container.children);
		this.sliders.forEach((item,i,arr)=>{
				this.box.append(item);
		});			
		this.container.append(this.box);
		this.box.style.display = 'flex';
		this.box.style.width = '100%';
		this.box.style.maxWidth = '100vw';
		this.box.style.overflow = 'hidden';
	}

	createSliderNavigationArrows(){
		let slider_arrow_right = document.createElement('div');
		slider_arrow_right.classList = 'slider_arrow slider_arrow-right';
		slider_arrow_right.innerHTML = `<svg width="37" height="36" viewBox="0 0 37 36" fill="none" xmlns="http://www.w3.org/2000/svg">
		<rect x="18.6445" y="35.2929" width="24.4558" height="24.4558" rx="3.5" transform="rotate(-135 18.6445 35.2929)"/>
		<path d="M17.2983 21.7448L21.3713 17.6718L17.2983 13.5989" stroke-width="1.5"/>
		</svg>`
		slider_arrow_right.onclick = ()=> this.slideMove({direction: 'right'});
		this.container.append(slider_arrow_right);

		let slider_arrow_left = document.createElement('div');
		slider_arrow_left.classList = 'slider_arrow slider_arrow-left';
		slider_arrow_left.innerHTML = `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
		<rect x="18" y="0.707107" width="24.4558" height="24.4558" rx="3.5" transform="rotate(45 18 0.707107)"/>
		<path d="M19.3462 14.2554L15.2733 18.3283L19.3462 22.4012" stroke-width="1.5"/>
		</svg>`
		slider_arrow_left.onclick = ()=> this.slideMove({direction: 'left'});
		this.container.append(slider_arrow_left);
	}

	createSliderNavigationCounter(){
		let slider_counter = document.createElement('div');
		slider_counter.classList = 'slider_counter';

		let numberStart = `01`;
		let numberEnd = Math.ceil(this.sliders.length / this.slideOnScreen);
		numberEnd = (numberEnd<10) ? `0${numberEnd}` : numberEnd;

		slider_counter.innerHTML = `<span class="slider_counter_number slider_counter_number-start">${numberStart}</span><span class="slider_counter_line"></span><span class="slider_counter_number slider_counter_number-end">${numberEnd}</span>`;
		this.container.append(slider_counter);
	}

	changeSliderNavigationCounter(){
		let numberStart = Math.ceil(this.activeSlider/this.slideOnScreen) + 1;
		if(numberStart < 1) numberStart = 1;
		numberStart = (numberStart<10) ? `0${numberStart}` : numberStart;

		this.container.querySelectorAll('.slider_counter_number-start')[0].textContent = numberStart;
	}

	createSliderNavigationDotters(){
		let slider_nav = document.createElement('ul');
		slider_nav.classList = 'slider_nav';

		this.butts = [];
		for(let i=0; i<this.sliders.length; i++){
			let slider_nav_butt = document.createElement('li');
			slider_nav_butt.classList = 'slider_nav_butt';
			this.butts.push(slider_nav_butt);
		}

		this.butts.forEach((butt,i,arr)=>{
			butt.addEventListener('click',func.bind(this));
			slider_nav.append(butt);
			
			function func(){
				return this.slideMove({counter: i});
			}
		});

		this.container.append(slider_nav);
	}

	extendSlides(){
		this.boxWidth = this.box.offsetWidth/this.slideOnScreen;

		if(this.params.multiDisplay && this.params.multiDisplay.marginRight){
			let marginRight;
			let w = document.body.offsetWidth 
			if(w>0 && w<=700){
				marginRight = this.params.multiDisplay.marginRight.mobile;
			} else if(w>700 && w<=1100){
				marginRight = this.params.multiDisplay.marginRight.touch;
			} else {
				marginRight = this.params.multiDisplay.marginRight.desktop;
			}

			this.sliders.forEach((slide,i,arr)=>{
				let d = this.boxWidth - (marginRight * (this.slideOnScreen - 1)) / this.slideOnScreen;	
				slide.style.width = `${d}px`;
				slide.style.minWidth = `${d}px`;
				if((i + 1) % this.slideOnScreen) slide.style.marginRight = `${marginRight}px`;
			});			
		} else {
			this.sliders.forEach((slide,i,arr)=>{	
				slide.style.width = `${this.boxWidth}px`;
				slide.style.minWidth = `${this.boxWidth}px`;
			});
		}
	}

	slideAll(){
		let n = 0;

		this.sliders.forEach((slide,i,arr)=>{
			if(slide.classList.contains('active')){
				this.boxShift = -(i * this.boxWidth);
				arr[0].style.marginLeft = `${this.boxShift}px`;
				n = i;
			}
		});

		if(n == 0) this.sliders[0].classList.add('active');

		if(this.params.navigationDotters){
			this.butts.forEach((butt,i,arr)=>{
				butt.classList.remove('active');
				if(i==n) butt.classList.add('active');
			});
		};

		if(this.params.emulateDotters){
			this.emulSlides = [].slice.call(document.querySelector(this.params.emulateDotters).children);
			this.emulSlides.forEach((item,i)=>{
				item.classList.remove('active');
			})
			this.emulSlides[n].classList.add('active');	
		}
	}

	slideMove(params){
		this.sliders.forEach((slide,i,arr)=>{	
			if(slide.classList.contains('active')) this.activeSlider = i;
			slide.classList.remove('active');
		});

		if(this.params.multiDisplay && this.params.multiDisplay.multiShift){
			let m = this.sliders.length - (this.sliders.length % this.slideOnScreen);
			if(m == this.sliders.length) m = this.sliders.length - this.slideOnScreen;

			if(params.direction == 'right') this.activeSlider += this.slideOnScreen;
			if(params.direction == 'left') this.activeSlider -= this.slideOnScreen;
			if(params.counter != undefined) this.activeSlider = params.counter;
			if(this.activeSlider >= m) this.activeSlider = m;
			if(this.activeSlider < 0) this.activeSlider = 0;	
		} else {
			if(params.direction == 'right') this.activeSlider++;
			if(params.direction == 'left') this.activeSlider--;
			if(params.counter != undefined) this.activeSlider = params.counter;
			if(this.activeSlider > this.sliders.length - 1) this.activeSlider = this.sliders.length - 1;
			if(this.activeSlider < 0) this.activeSlider = 0;			
		}

		this.sliders[this.activeSlider].classList.add('active');
		this.slideAll();

		if(this.params.navigationCounter) this.changeSliderNavigationCounter();
	}

	mouseFlip(event){
		event.preventDefault();
		let x = this.sliders[0];		
		let mousePointStart = event.clientX;
		let mousePointCurrent = 0;

		let mouseMoveBinded = mouseMove.bind(this);
		function mouseMove(event){
			event.preventDefault();
			mousePointCurrent = event.clientX;
			let m = (mousePointCurrent - mousePointStart);
			x.style.marginLeft = `${this.boxShift + m}px`;

			if(m < -document.body.offsetWidth/4){
				this.slideMove({direction: 'right'});
				mousePointStart = mousePointCurrent;
				mouseUp.call(this,event);
			} else if(m > document.body.offsetWidth/4){
				this.slideMove({direction: 'left'});
				mousePointStart = mousePointCurrent;
				mouseUp.call(this,event);
			}
		}

		function mouseUp(event){
			event.preventDefault();
			this.box.removeEventListener('mousemove', mouseMoveBinded);
			mousePointStart = 0;
			mousePointCurrent = 0;
			x.style.marginLeft = `${this.boxShift}px`;
		}

		this.box.addEventListener('mousemove', mouseMoveBinded);
		this.box.addEventListener('mouseup', mouseUp.bind(this));
	}

	touchFlip(event){
		event.preventDefault();
		let x = this.sliders[0];		
		let touchPointStart = event.changedTouches['0'].screenX;
		let touchPointCurrent = 0;

		let touchMoveBinded = touchMove.bind(this);
		function touchMove(event){
	    	event.preventDefault();
	    	touchPointCurrent = event.changedTouches['0'].screenX;
	    	let m = touchPointCurrent - touchPointStart;

			if(m >= document.body.offsetWidth/4){
				this.slideMove({direction: 'left'});
				touchPointStart = touchPointCurrent;
				touchEnd.call(this,event);
			} else if(m <= -document.body.offsetWidth/4){
				this.slideMove({direction: 'right'});
				touchPointStart = touchPointCurrent;
				touchEnd.call(this,event);				
			}
  		}

		function touchEnd(event){
	    	event.preventDefault();
			this.box.removeEventListener('touchmove', touchMoveBinded);
			let touchPointStart = 0;
		    let touchPointCurrent = 0;
			x.style.marginLeft = `${this.boxShift}px`;
		}

		this.box.addEventListener('touchmove', touchMoveBinded);
		this.box.addEventListener('touchend', touchEnd.bind(this));
		this.box.addEventListener('touchcancel', touchEnd.bind(this));
	}
};


class News{
	constructor(selector){
		document.querySelectorAll(selector).forEach((container) => {
			this.container = container;
			this.head = this.container.querySelector('.news_head');
			this.box = this.container.querySelector('.news_box');
			this.newsCounter = 0;

			this.prepareJSON(this.prepare.bind(this));
		});
	}

	prepareJSON(callback){
		this.data = JSON.parse(newsData);
		callback();
	}

	prepare(){
		this.prepareLabels();
		this.setActualTag();
		this.createItems();
		this.prepareButton();
	}

	prepareLabels(){
		this.labels = this.head.querySelectorAll('li');
		this.labels.forEach((label,i) => {
			label.addEventListener('click',func.bind(this));

			function func(){
				this.setActualTag(i);
				this.createItems();
			}			
		})
	}

	setActualTag(n = 0){
		if(this.actualTag == this.labels[n].dataset.tag) return;

		this.labels.forEach((label,i) => {
			label.classList.remove('actual');
		})

		this.labels[n].classList.add('actual');
		this.actualTag = this.labels[n].dataset.tag;
	}

	createItems(){
		this.box.innerHTML = '';
		this.maxItemOnPage = 9;

		if(document.body.offsetWidth <= 700){
			this.maxItemOnPage = 6;
		}

		this.data.forEach((item,i) => {
			if(i < this.newsCounter || i >= this.newsCounter + this.maxItemOnPage) return;

			if(this.actualTag == 'all'){
				this.createItem(item)
			} else {
				if(!item.tags.split(' ').indexOf(this.actualTag)) this.createItem(item);
			}
		})

		this.newsCounter += this.maxItemOnPage;
	}

	createItem(data){
		let item = document.createElement('a');
		item.classList = `news_item ${data.tags}`;
		if(item.href) item.href = data.href;
		item.innerHTML = `<figure><img src="${data.src}" alt="" /></figure><figcaption>${data.title}</figcaption>`;
		this.box.append(item);
	}

	prepareButton(){
		this.container.querySelectorAll('.news_load').forEach((button)=>{
			button.addEventListener('click',func.bind(this));

			function func(){
				this.createItems();
			}
		})
	}
};


function clickItemHandler(event){
	if(!event.target.closest('.click-item')) return;
	let item = event.target.closest('.click-item');	

	let obj = {
		'toggle': function(target){
			target.closest('.click-obj').classList.toggle('active');
		},

		'menu': toggleMenu,
	}

	let action = item.dataset.action ? item.dataset.action : 'toggle';
	obj[action](item);
};

function toggleMenu(target){
	let menu = target.closest('.click-obj');
	menu.classList.toggle('active');

	let c;
	target.classList.forEach((cl) => {
		if(cl != 'active' && cl != 'click-item') c = `.${cl}`;
	});

	menu.querySelectorAll(c).forEach(item => item.classList.remove('active'));
	target.classList.add('active');
}

function startVideo(event){
	if(!event.target.closest('.video_box')) return;
	let box = event.target.closest('.video_box');

	let img = box.querySelector('img');

	box.classList.add('active');
	box.innerHTML = `<iframe src="${img.dataset.src}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
}