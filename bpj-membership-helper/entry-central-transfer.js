const entryCentralAllowedUrls = [
    'https://www.entrycentral.com/organiser/orgEntryForm.php',
    'https://www.entrycentral.com/organiser/changeDetails.php',
];

if (entryCentralAllowedUrls.filter(entryCentralAllowedUrl => location.href.includes(entryCentralAllowedUrl)).length > 0) {
    console.log('BPJ Helper enabled: Entry Central Transfer', location.href);

    var entryDetailsForm = document.querySelector(
        'form[action="changeDetails.php"]'
    );

    var form = {
        firstName: document.querySelector('[name="forename"'),
        lastName: document.querySelector('[name="surname"'),
        dob: {
            day: document.querySelector('[name="dob_day"]'),
            month: document.querySelector('[name="dob_month"]'),
            year: document.querySelector('[name="dob_year"]'),
        },
        gender: document.querySelector('[name="gender"]'),
        club: document.querySelector('[name="club"]'),
        clubAffiliated: document.querySelector('[name="isClubAffiliated"]'),
        governingBody: document.querySelector(
            '[name="memberOfGoverningBodySelect"]'
        ),
        urn: document.querySelector('[name="membershipNo"]'),
        address: {
            line1: document.querySelector('[name="address1"]'),
            line2: document.querySelector('[name="address2"]'),
            town: document.querySelector('[name="town"]'),
            county: document.querySelector('[name="region"]'),
            postCode: document.querySelector('[name="postcode"]'),
        },
        email: document.querySelector('[name="email"]'),
        phone: document.querySelector('[name="phone"]'),
    };

    var containerElement = document.createElement('div');
    containerElement.className = 'bpj';
    entryDetailsForm.parentNode.insertBefore(
        containerElement,
        entryDetailsForm
    );

    containerElement.innerHTML = `
    <label class="bpj__label" for="bpj-textarea">Paste a row from the race transfer spreadsheet below</label>
    <textarea class="bpj__textarea" id="bpj-textarea"></textarea>
`;

    var newMemberInput = document.querySelector('#bpj-textarea');

    newMemberInput.addEventListener('focus', clearInput.bind(this));
    newMemberInput.addEventListener('change', inputUpdated.bind(this));
    newMemberInput.addEventListener('paste', inputUpdated.bind(this));

    addStyles();

    function clearInput(e) {
        e.target.value = '';
    }

    function inputUpdated(e) {
        setTimeout(() => {
            fillForm(parseInput(e.target.value));
            newMemberInput.blur();
        });
    }

    function updateValue(input, value) {
        input.value = value;
        input.style.backgroundColor = '#cfc';
        input.dispatchEvent(new Event('change'));
    }

    function fillForm(input) {
        if (!input) return;
        updateValue(form.firstName, input[3]);
        updateValue(form.lastName, input[4]);
        updateValue(form.dob.day, Number(input[5].split('/')[0]));
        updateValue(form.dob.month, Number(input[5].split('/')[1]));
        updateValue(form.dob.year, input[5].split('/')[2]);
        updateValue(form.gender, input[6]);
        updateValue(form.club, input[7]);
        updateValue(form.urn, '');

        if (input[7]) {
            if (form.clubAffiliated !== null) {
                form.clubAffiliated.checked = true;
            }

            updateValue(form.governingBody, '31');
        } else {
            if (form.clubAffiliated !== null) {
                form.clubAffiliated.checked = false;
            }

            updateValue(form.governingBody, '0');
        }

        updateValue(form.address.line1, input[8]);
        updateValue(form.address.line2, input[9]);
        updateValue(form.address.town, input[10]);
        updateValue(form.address.county, input[11]);
        updateValue(form.address.postCode, input[12]);
        updateValue(form.email, input[13]);
        updateValue(form.phone, input[14]);
    }

    function parseInput(input) {
        if (!input || input.indexOf('accept the terms') === -1) return;
        var parsedInput = input.split('\t');
        parsedInput[1] = parsedInput[1].toUpperCase();
        parsedInput[11] = parsedInput[11].replace(/[\W_]+/g, ' ').toUpperCase();
        parsedInput[12] = cleanPhoneNumber(parsedInput[12]);
        return parsedInput;
    }

    function cleanPhoneNumber(input) {
        if (!input) return;
        parsedInput = input.replace(' ', '');
        if (parsedInput.substring(0, 1) === '0') {
            parsedInput = parsedInput.substring(1);
        }
        return parsedInput;
    }

    function addStyles() {
        var node = document.createElement('style');
        node.innerHTML = `
        .bpj {
            background-color: #fff;
            padding: 24px;
            margin: 20px 0;
            border-radius: 2px;
            box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12), 0 1px 5px 0 rgba(0,0,0,0.2);
        }
        .bpj__textarea {
            width: 100%;
            height: 50px;
            border: 0;
            box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12), 0 1px 5px 0 rgba(0,0,0,0.2);
            padding: 10px;
            margin-top: 10px;
            box-sizing: border-box;
        }
    `;
        document.body.appendChild(node);
    }
}
