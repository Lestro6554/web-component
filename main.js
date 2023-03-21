customElements.define('find-company',
  class extends HTMLElement {
    constructor() {
      super();

      const template = document.getElementById('find-company-template');
      const templateContent = template.content;

      const shadowRoot = this.attachShadow({ mode: 'open' });

      const style = document.createElement('style');
      style.textContent = `
        .result {
          width: 50%;
          min-width: 400px;
        }
        .row {
          margin-top: 1em;
        }
      `;

      shadowRoot.appendChild(style);
      shadowRoot.appendChild(templateContent.cloneNode(true));

      const fetchData = (query) => {
        const url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party";
        const token = "token";

        const options = {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": "Token " + token
          },
          body: JSON.stringify({ query: query })
        }

        fetch(url, options)
          .then(response => response.text())
          .then(result => {
            const data = JSON.parse(result);
            setOption(data);
          })
          .catch(error => console.log("error", error));
      }

      const party = document.getElementById('party');
      const dataList = document.createElement('datalist');

      party.setAttribute('list', 'dropdown');
      dataList.setAttribute('id', 'dropdown');
      party.after(dataList);

      function debounce(f, ms) {
        return function (...args) {

          let previousCall = this.lastCall
          this.lastCall = Date.now()

          if (previousCall && this.lastCall - previousCall <= ms) {
            clearTimeout(this.lastCallTimer)
          }

          this.lastCallTimer = setTimeout(() => f(...args), ms)
        }
      }

      const setOption = (data) => {
        if (data && (data.length != 0)) {
          const arr = data.suggestions;
          
          for (let i = 0; i < arr.length; i++) {
            const value = arr[i].value;
            const inn = arr[i].data.inn ? arr[i].data.inn : arr[i].data.kpp;
            const adres = arr[i].data.address.value;

            const option = document.createElement("option");
            const p = document.createElement("p");
            option.value = value;

            p.textContent = inn + " " + adres;
            option.appendChild(p);
            dataList.appendChild(option);

            if (value === party.value) {
              selectedCompany(arr[i]);
              break;
            }
          }
        }
      }

      const clearDataList = () => {
        const option = document.getElementsByTagName("option");
        const arr = [...option];

        if (arr.length != 0) {
          for (let i = 0; i < arr.length; i++) {
            dataList.removeChild(arr[i]);
          }
        }
      }

      function getQuery(e) {
        const { value } = e.target;
        clearDataList();
        fetchData(value);
      }

      const selectedCompany = (data) => {
        const value = data.value;
        const fullname = data.data.name.full_with_opf;
        const inn = data.data.inn ? data.data.inn : data.data.kpp;
        const adres = data.data.address.value;
        const type = data.data.type;

        const p_type = document.getElementById("type_company");
        const name_short = document.getElementById("name_short");
        const name_full = document.getElementById("name_full");
        const inn_kpp = document.getElementById("inn_kpp");
        const address = document.getElementById("address");

        p_type.textContent = `Организация (${type})`;
        name_short.value = value;
        name_full.value = fullname;
        inn_kpp.value = inn;
        address.value = adres;
        
      }

      const debounceQuery = debounce(getQuery, 500);
      party.addEventListener('input', debounceQuery);
    }
  }
);
/*
customElements.define('edit-word',
  class extends HTMLElement {
    constructor() {
      super();

      const shadowRoot = this.attachShadow({ mode: 'open' });
      const form = document.createElement('form');
      const input = document.createElement('input');
      const span = document.createElement('span');

      const style = document.createElement('style');
      style.textContent = 'span { background-color: #eef; padding: 0 10px }';

      shadowRoot.appendChild(style);
      shadowRoot.appendChild(form);
      shadowRoot.appendChild(span);

      span.textContent = this.textContent;
      input.value = this.textContent;

      form.appendChild(input);
      form.style.display = 'none';
      span.style.display = 'inline-block';
      input.style.width = span.clientWidth + 'px';

      this.setAttribute('tabindex', '0');
      input.setAttribute('required', 'required');
      this.style.display = 'inline-block';

      this.addEventListener('click', () => {
        span.style.display = 'none';
        form.style.display = 'inline-block';
        input.focus();
        input.setSelectionRange(0, input.value.length)
      });

      form.addEventListener('submit', e => {
        updateDisplay();
        e.preventDefault();
      });

      input.addEventListener('blur', updateDisplay);

      function updateDisplay() {
        span.style.display = 'inline-block';
        form.style.display = 'none';
        span.textContent = input.value;
        input.style.width = span.clientWidth + 'px';
      }
    }
  }
);
*/