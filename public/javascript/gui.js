const lang = document.documentElement.lang.toUpperCase();
let category = "suicide";
let subcategory = "Suicide rate (per 100,000 population)";
const max_z_index = "3001";

// enable tooltips
$(function() {
    $('[data-toggle="tooltip"]').tooltip()
})

// enable selects and button
function enable_categories() {
    document.querySelector("#selected-country").innerHTML = country;
    document.querySelector("#category").disabled = false;
    document.querySelector("#subcategory").disabled = false;
    document.querySelector("#search").disabled = false;
}

// SIDEBAR

// on/off sidebar
const toggle_sidebar = () => {
    let sidebar = document.querySelector("#sidebar");

    if (sidebar.classList.contains("side-hidden")) {
        sidebar.classList.remove("side-hidden");
        sidebar.classList.add("side-active");
    } else {
        sidebar.classList.remove("side-active");
        sidebar.classList.add("side-hidden");
    }
}

document.querySelector('#open-arrow').addEventListener('click', toggle_sidebar);

// ALERTS
const alert_html = (alert, type) => {
    return `
    <div class="alert alert-${type} alert-dismissible fade show col-md-6 offset-md-3" role="alert">
        <div><i class="fas fa-exclamation-triangle mr-3 ml-2r" style="font-size: 15pt;"></i>
        <span id="warn-info">${alert}</span></div>
        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
    </div>
`
}

// show alert
const show_alert = (alert, type) => {
    document.querySelector("#alerts").innerHTML = alert_html(alert, type);
}

const first_visit_info = () => { // when user first visit
    if (!localStorage.getItem('show_tutorial')) {
        show_alert(languageText[lang].firstVisit, 'info')
        document.querySelector('#tutorial').classList.add('pulse')
        localStorage.setItem('show_tutorial', true)
    }
}

first_visit_info();

// CATEGORY & SUBCATEGORIES
let category_select = document.querySelector("#category");

// create options in category select
const prepare_categories_options = () => {
    for (let category in categories) {
        const category_value = category;
        const category_name = categories[category][`name${lang}`];
        category_select.innerHTML += `<option value="${category_value}">${category_name}</option>`;
    }
    prepare_subcategories_options()
}

prepare_categories_options()

// create options in subcategory select
function prepare_subcategories_options() {
    let subcategory_select = document.querySelector("#subcategory");
    subcategory_select.innerHTML = "";
    let subcategories;
    category = this.value || "suicide";
    choose_subcategory()

    subcategories = categories[category]["subcategories"];

    for (let subcategory of subcategories) {
        if (subcategory.displayName) {
            subcategory_select.innerHTML += `<option value="${subcategory[`name${lang}`]}">${subcategory.displayName}</option>`;
        } else {
            subcategory_select.innerHTML += `<option value="${subcategory[`name${lang}`]}">${subcategory[`name${lang}`]}</option>`;
        }
    }
}

function choose_subcategory() {
    subcategory = this.value || categories[category]["subcategories"][0][`name${lang}`];
}

// MODES
const items_mode = document.querySelectorAll(".mode");

function change_mode() {
    mode = this.value;
    destroyPoligons()

    items_mode.forEach(item => {
        item.classList.remove("active-mode");
    })

    this.classList.add("active-mode")

    if (mode == "multi") {
        btn_add_country.style.visibility = "visible";
        document.querySelector("#selected-countries").style.display = "block";
        document.querySelector('#years-range').style.display = 'none';
        document.querySelector('#legend').style.display = 'none';
        document.querySelector("#hidden-gui").style.visibility = 'hidden';
        resetView();
    } else if (mode == "single") {
        btn_add_country.style.visibility = "hidden";
        document.querySelector("#selected-countries").style.display = "none";
        document.querySelector('#years-range').style.display = 'none';
        document.querySelector('#legend').style.display = 'none';
        document.querySelector("#hidden-gui").style.visibility = 'hidden';
        resetView();
    } else if (mode == "global") {
        btn_add_country.style.visibility = "hidden";
        document.querySelector("#selected-countries").style.display = "none";
        document.querySelector('#legend').style.display = 'block';
        document.querySelector("#hidden-gui").style.visibility = 'visible';
        resetView();
        enable_categories();
        document.querySelector('#selected-country').innerHTML = languageText[lang].globalMode;
    }
}

items_mode.forEach(item => {
    item.addEventListener("click", change_mode);
})

// GLOBAL MODE

let active_years;

const legend_color_list = gradient => {
    const legend_list = document.querySelector('.legend-list');
    legend_list.innerHTML = "";

    for (let i = gradient.length - 1; i >= 0; i--) {
        legend_list.innerHTML += `<li class='legend-list__item'><div class="color" style='background-color: ${gradient[i]}'></div><div class='compartments'></div></li>`;
    }
    gradient.splice(0, 1);
    return gradient
}

const legends_colors = () => {
    const colors = [document.querySelector('#color1').value, document.querySelector('#color2').value];
    let gradient = generateGradient(colors[1], colors[0], 5);
    gradient.unshift('#5e5e5e');

    return gradient
}

function change_year(){
    destroyPoligons();
    drawBorders(legend, borders, blacklist, active_years[this.value]);
}

function output(){
    let range = document.querySelector('#years');
    const value = Number(((range.value - range.min) * 100) / (range.max - range.min))
    const left = `calc(${value}% + (${-22 - value * 0.15}px))`;
    document.querySelector('#output').style.left = left;
}

document.querySelector('#years').addEventListener('change', change_year)
document.querySelector('#years').addEventListener('input', output)

const years_list = (years) => {
    active_years = years;
    const years_list = document.querySelector('#years__list');
    years_list.innerHTML = "";
    const years_range = document.querySelector('#years');
    const output_item = document.querySelector('#output');
    years_range.min = 0; years_range.max = years.length - 1; years_range.step = 1; years_range.value = years.length - 1;
    if(years.length > 1){
        output_item.innerHTML = active_years[years_range.value]; output_item.style.visibility = 'visible';
        output();
    }
    else{
        output_item.style.visibility = 'hidden';
    }

    for(let i = 0; i <  years.length; i++){
        if(years.length > 20){
            if(i % 2 === 0){
                years_list.innerHTML += `<option value="${years[i]}" label="${years[i]}">`
            }
            continue;
        }
        years_list.innerHTML += `<option value="${years[i]}" label="${years[i]}">`
    }
}

const legend_compartments = (legend) => {
    const compartments_list = document.querySelectorAll('.compartments');

    let index = 0;
    for(let i = legend.length-1; i >=  0; i--){
        compartments_list[i].innerHTML = `${legend[index].compartment['from'].toFixed(1)} - ${legend[index].compartment['to'].toFixed(1)}`
        index++;
    }
    compartments_list[compartments_list.length-1].innerHTML = languageText[lang].noDataPolygon;
}


// MULTI MODE

const btn_add_country = document.querySelector("#add");

const list_item = name => {
    return `
        <li class="selected-countries__item" data-name="${name}">${name}
        <span class="remove"><i class="fas fa-times"></i></span></li>
    `;
}

const update_country_list = () => {
    const list = document.querySelector(".selected-countries__list");
    const latest_country = countries.length - 1;
    if (countries[latest_country] != undefined) {
        list.innerHTML += list_item(countries[latest_country], latest_country);
        document.querySelectorAll(".remove").forEach(item => item.addEventListener('click', delete_country))
    }
}

btn_add_country.addEventListener("click", () => {
    if(addCountry() == true){
        update_country_list();
    }
})


function delete_country() {
    const name = this.parentElement.dataset.name;
    document.querySelectorAll(".remove").forEach((item, index) => {
        if (item.parentElement.dataset.name == name) {
            countries.splice(index, 1);
        }
    })
    this.parentElement.remove();
}


// MODAL

const update_modal_header = (unit) => {
    const categoryDisplay = categories[category][`name${lang}`];
    const modal_title = document.querySelector(".modal-title");
    document.querySelector('#chart_type').selectedIndex = 0;
    if (mode == "multi") {
        let country_list = countries.join(", ");
        modal_title.innerHTML = `<b>${languageText[lang].modalText[0]}:</b> ${country_list}, <b>${languageText[lang].modalText[1]}:</b> ${categoryDisplay}, <b>${languageText[lang].modalText[2]}:</b> ${subcategory} ${unit ? `, <b>${languageText[lang].modalText[3]}:</b> ` + unit : ``}`;
        return false;
    }
    modal_title.innerHTML = `<b>${languageText[lang].modalText[0]}:</b> ${country}, <b>${languageText[lang].modalText[1]}:</b> ${categoryDisplay}, <b>${languageText[lang].modalText[2]}:</b> ${subcategory} ${unit ? `, <b>${languageText[lang].modalText[3]}:</b> ` + unit : ``}`;
}

const btn_fullscreen = document.querySelector(".fullscreen");

btn_fullscreen.addEventListener("click", () => {
    document.querySelector(".modal-dialog").classList.toggle("modal-dialog__fullscreen");
    document.querySelector(".modal-content").classList.toggle("modal-content__fullscreen");
})


// CHART

// search code for api url
const search_code = (category, subcategory) => {
    for (let sub of categories[category]["subcategories"]) {
        if (sub.nameEN === subcategory || sub.namePL === subcategory) {
            return sub
        }
    }
}

const warning_global = () => {
    if(!localStorage.getItem('is_visited')){
        document.querySelector('#global_alert').style.visibility = 'visible';
    }
    else{
        const active_sub_code = search_code(category, subcategory);
        fetchGlobal(active_sub_code.code);
        document.querySelector('#years-range').style.display = 'block';
    }
}

document.querySelector('#cancel-btn').addEventListener('click', () => {
    document.querySelector('#global_alert').style.visibility = 'hidden';
})

document.querySelector('#accept-btn').addEventListener('click', () => {
    localStorage.setItem('is_visited', true)
    document.querySelector('#years-range').style.display = 'block';
    document.querySelector('#global_alert').style.visibility = 'hidden';

    const active_sub_code = search_code(category, subcategory);
    fetchGlobal(active_sub_code.code);
})


category_select.addEventListener("change", prepare_subcategories_options);
document.querySelector("#subcategory").addEventListener("change", choose_subcategory)

document.querySelector("#search").addEventListener("click", () => {
    const active_sub_code = search_code(category, subcategory);
    update_modal_header(active_sub_code.unit);
    destroyPoligons()

    if (mode == "single") {
        fetchSingleCountry(active_sub_code.code)
    } else if (mode == "multi") {
        fetchMultipleCountries(active_sub_code.code)
    } else if (mode == "global") {
        warning_global()
        
    } else {
        show_alert(`No mode named: ${mode}`, "danger")
    }
})

function change_type_chart() {
    chart.config.type = this.value;
    chart.update();
}

document.querySelector("#chart_type").addEventListener("click", change_type_chart)

// ALL GUI SHOW OR HIDE

let hidden_gui_mode = false

const hide_gui = () => {
    document.querySelector('#output').style.visibility = 'hidden';
    document.querySelector('#sidebar').style.visibility = 'hidden';
    document.querySelector('#legend').classList.add('print-legend');
    document.querySelector('.main-nav').style.visibility = 'hidden';
    document.querySelector('.mode-nav').style.visibility = 'hidden';
    document.querySelector('#years-range').style.visibility = 'hidden';
    document.querySelector('#hidden-gui').style.visibility = 'hidden';
    document.querySelector('#no-cursor').style.visibility = 'visible';
    document.querySelector('.inputs-color').style.display = 'none';
    document.querySelector('.legend-title').style.display = 'none';
    document.querySelector('.print-legend__title').style.display = 'block';
    document.querySelector('.print-legend__title').innerHTML = subcategory;
    document.querySelector('#sidebar').classList.remove('side-active');
    document.querySelector('#sidebar').classList.add('side-hidden')
    clearTimeout(timeout)
    map.setOptions({ disableDefaultUI: true})
    show_alert("To exit click escape!", "info");
    setTimeout(() => {$(".alert").alert('close')}, 3000)
    hidden_gui_mode = true;
}

const show_gui = () => {
    document.querySelector('.print-legend__title').style.display = 'none';
    document.querySelector('#output').style.visibility = 'visible';
    document.querySelector('#sidebar').style.visibility = 'visible';
    document.querySelector('#legend').classList.remove('print-legend');
    document.querySelector('.main-nav').style.visibility = 'visible';
    document.querySelector('.mode-nav').style.visibility = 'visible';
    document.querySelector('#years-range').style.visibility = 'visible';
    document.querySelector('#hidden-gui').style.visibility = 'visible';
    document.querySelector('#no-cursor').style.visibility = 'hidden';
    document.querySelector('.inputs-color').style.display = 'block';
    document.querySelector('.legend-title').style.display = 'block';
    map.setOptions({ disableDefaultUI: false})
    hidden_gui_mode = false;
}

document.querySelector('#hidden-gui').addEventListener('click', hide_gui);

window.addEventListener('keydown', (event) => {
    if(hidden_gui_mode){
        if(event.key == 'Escape'){
            show_gui();
        }
    }
})

// TUTORIAL MODE
let is_tutorial_mode = false;
let number_hint = 0;


// reset css styles
const reset_css = () => {
    document.querySelector(".container_toasts").style.visibility = "hidden";
    document.querySelector('.end_tutorial').style.visibility = "hidden"
    document.querySelector('.main-nav').style.zIndex = '1';
    document.querySelector('#sidebar').classList.remove('side-active');
    document.querySelector('#sidebar').classList.add('side-hidden')
    document.querySelector('.mode-nav').style.zIndex = "1";
    document.querySelector("#single").click();
    document.querySelector('.fullscreen').style.color = '';
    document.querySelector('.fullscreen').style.fontSize = '';
    document.querySelector('#years-range').style.zIndex = "1";
    close_modal()
}

// reset tutorial mode, reset variables
const reset_tutorial_mode = () => {
    let toast = document.querySelector(".toast")
    is_tutorial_mode = false;

    if (number_hint) {
        toast.style.gridArea = toasts[0].position;
    }

    number_hint = 0;
}

// turn on tutorial mode
document.querySelector("#tutorial").addEventListener("click", () => {
    is_tutorial_mode = true;
    $(".toast").toast("show")
    document.querySelector(".container_toasts").style.visibility = "visible";
    document.querySelector('.end_tutorial').style.visibility = "hidden";
    render_toast()
})

// turn off tutorial mode
document.querySelector(".exit").addEventListener("click", () => {
    reset_tutorial_mode()
    reset_css()
})

// imitating user events

const active_sidebar = () => {
    document.querySelector('#sidebar').classList.remove('side-hidden');
    document.querySelector('#sidebar').classList.add('side-active')
}

const hidden_sidebar = () => {
    document.querySelector('#sidebar').classList.remove('side-active');
    document.querySelector('#sidebar').classList.add('side-hidden')
}

const show_modal = () => {
    document.querySelector("#search").disabled = false;
    document.querySelector("#search").click();
    document.querySelector("#search").disabled = true;
}

const close_modal = () => {
    document.querySelector('.modal').style.zIndex = '1050';
    document.querySelector(".close").click()
}

const change_to_multi_mode = () => {
    document.querySelector("#multi").click();
}

const sample_country_list = country_num => {
    const sample = ["Poland", "Germany", "France"];
    countries.push(sample[country_num])
    update_country_list()
}

const clear_country_list = () => {
    countries = [];
    document.querySelector(".selected-countries__list").innerHTML = "";
}

const global_mode = () => {
    document.querySelector('#global').click();
    document.querySelector('#search').click();
}

// toast service
const next_toast = () => {
    if (number_hint === toasts.length - 1) {
        document.querySelector('.end_tutorial').style.visibility = "visible";
        document.querySelector('#years-range').style.zIndex = "1";
        $(".toast").toast("hide");
        
        hidden_sidebar()
        clear_country_list();
        return false;
    }
    number_hint++;
    render_toast()
    console.log(number_hint)
}

const render_toast = () => {
    const active = toasts[number_hint]
    let toast = document.querySelector(".toast")
    let toast_body = document.querySelector(".toast-body");
    toast_body.innerHTML = active[`text${lang}`];
    console.log(number_hint)

    switch(number_hint){
        case 0: 
            mode = 'single';
            resetView();
            break;
        case 1:
            document.querySelector('.main-nav').style.zIndex = max_z_index;
            break;
        case 2:
            active_sidebar()
            document.querySelector('.main-nav').style.zIndex = "1";
            document.querySelector('#sidebar').style.zIndex = max_z_index;
            break;
        case 4:
            document.querySelector('#sidebar').style.zIndex = "1";
            country = "Poland";
            show_modal();
            break;
        case 5:
            document.querySelector('.fullscreen').style.color = 'rgb(66, 117, 244)';
            document.querySelector('.fullscreen').style.fontSize = '2rem';
            break;
        case 6:
            document.querySelector('.fullscreen').style.color = '';
            document.querySelector('.fullscreen').style.fontSize = '';
            document.querySelector('.mode-nav').style.zIndex = max_z_index;
            close_modal();
            break;
        case 7:
            change_to_multi_mode();
            document.querySelector('.mode-nav').style.zIndex = "1";
            document.querySelector('.main-nav').style.zIndex = max_z_index;
            break;
        case 8:
            document.querySelector('.main-nav').style.zIndex = "1";
            document.querySelector('#sidebar').style.zIndex = max_z_index;
            sample_country_list(0);
            sample_country_list(1);
            sample_country_list(2);
            break;
        case 9:
            document.querySelector('#years-range').style.display = 'block';
            document.querySelector('#global_alert').style.visibility = 'hidden';
            document.querySelector('#sidebar').style.zIndex = '1';
            document.querySelector('.main-nav').style.zIndex = max_z_index;
            break;
        case 10:
            document.querySelector('.main-nav').style.zIndex = "1";
            document.querySelector('#sidebar').style.zIndex = max_z_index;
            break;
        case 11: 
            document.querySelector('#sidebar').style.zIndex = "1";
            document.querySelector('#years-range').style.zIndex = max_z_index;
            break;
        case 12:
            break;
    }

    toast.style.gridArea = active.position;
}


document.querySelector("#next").addEventListener("click", () => {
    next_toast()
})

// SIMULATION

const range = document.querySelector('#years');
const play_btn = document.querySelector('.play');
let value = 0;
let timeout;
const simulation = () => {
    destroyPoligons();
    let min_max = [range.min, range.max];

    document.querySelector('#sidebar').classList.remove('side-active');
    document.querySelector('#sidebar').classList.add('side-hidden')
    play_btn.disabled = true;

    drawBorders(legend, borders, blacklist, active_years[value]);

    document.querySelector('#years').value = value
    output();
    document.querySelector('#output').innerHTML = active_years[value]

    range.value = value;
    if(value == min_max[1]){
        play_btn.disabled = false
        document.querySelector('#sidebar').classList.remove('side-hidden')
        document.querySelector('#sidebar').classList.add('side-active')

        value = 0;
        return false;
    }
    value++;
    timeout = setTimeout(simulation, 2500);
}
play_btn.addEventListener('click', simulation);