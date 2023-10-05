const addMemberUrls = [
    "https://myathleticscommon.englandathletics.org/portal/Secretaries/Add_Member",
    "https://myathleticsportal.englandathletics.org/Organisation/AddMember/-1",
];

if (addMemberUrls.filter(addMemberUrl => location.href.includes(addMemberUrl)).length > 0) {
    console.log('BPJ Helper enabled: Add member');

    var addMemberForm = document.querySelector('form.js-member-validation');

    var form = {
        title: document.querySelector('[name="Name.Title"]'),
        firstName: document.querySelector('[name="Name.FirstName"]'),
        lastName: document.querySelector('[name="Name.Surname"]'),

        dob: document.querySelector('[name="DateOfBirth"]'),
        gender: document.querySelector('[name="Gender"]'),

        houseNumber: document.querySelector('[name="Address.Number"]'),
        postCode: document.querySelector('[name="Address.Postcode"]'),

        email: document.querySelector('[name="EmailAddress"]'),
        phone: document.querySelector('[name="HomeTelephoneString"]'),

        membershipType: document.querySelector('[name="membershipTypeId"]'),

        registrationType: document.querySelector('[name="RegistrationType"]'),
        election: document.querySelector('[name="DateOfElection"]'),
        consent: document.querySelector('[name="DataProcessingBoxChecked"]'),
        agreeRules: document.querySelector('[name="CompetitiveAthleteBoxChecked"]'),
        requestPayment: document.querySelector('[name="RequestPayment"]'),
        findAddress: document.querySelector('a.findAddress'),
        manualAddressLink: document.querySelector('.js-enter-manually'),
        manualAddress: {
            houseNumber: document.querySelector('input.ModalHouseNumber'),
            line1: document.querySelector('[name="Address.Line1"]'),
            line2: document.querySelector('[name="Address.Line2"]'),
            line3: document.querySelector('[name="Address.Line3"]'),
            town: document.querySelector('[name="Address.Town"]'),
            county: document.querySelector('[name="Address.Region.Code"]'),
            postCode: document.querySelector('[name="Address.Postcode"]'),
        },
    };

    var containerElement = document.createElement('div');
    containerElement.className = 'bpj';
    addMemberForm.parentNode.insertBefore(containerElement, addMemberForm);

    containerElement.innerHTML = `
    <label class="bpj__label" for="bpj-textarea">Paste a row from the membership spreadsheet below</label>
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
        console.log(input, value);
        input.value = value;
        input.dispatchEvent(new Event('change'));
    }

    function fillForm(input) {
        if (!input) return;
        updateValue(form.title, input[1]);
        updateValue(form.firstName, input[2]);
        updateValue(form.lastName, input[3]);
        updateValue(form.dob, `${input[5].split('/')[2]}-${input[5].split('/')[1]}-${input[5].split('/')[0]}`);
        updateValue(form.gender, input[4]);
        updateValue(form.email, input[13]);
        updateValue(form.phone, input[12]);
        updateValue(form.membershipType, getMembershipType(input[18]));
        updateValue(form.registrationType, input[18].includes('Standard') ? 'ATHLETE ATHCOMP' : 'ATHLETE ATHSOC');
        updateValue(form.election, `${input[0].split('/')[2].substring(0, 4)}-${input[0].split('/')[1]}-${input[0].split('/')[0]}`);

        form.manualAddressLink.click();
        updateValue(form.manualAddress.line1, input[6]);
        updateValue(form.manualAddress.line1, input[6]);
        updateValue(form.manualAddress.line2, input[7]);
        updateValue(form.manualAddress.line3, input[8]);
        updateValue(form.manualAddress.town, input[9]);
        updateValue(form.manualAddress.county, input[10]);
        updateValue(form.manualAddress.postCode, input[11]);

        form.consent.checked = true;
        form.agreeRules.checked = true;
        form.requestPayment.checked = true;
    }

    function parseInput(input) {
        if (!input || input.indexOf('membership') === -1) return;
        var parsedInput = input.split('\t');
        parsedInput[11] = parsedInput[11].replace(/[\W_]+/g, ' ').toUpperCase();
        parsedInput[12] = cleanPhoneNumber(parsedInput[12]);
        return parsedInput;
    }

    function cleanPhoneNumber(input) {
        if (!input) return;
        parsedInput = input.trim().replace('+44', '0').replace(' ', '');
        if (parsedInput.substring(0, 1) !== '0') {
            parsedInput = `0${parsedInput}`;
        }
        return parsedInput;
    }

    function getMembershipType(input) {
        var month = new Date().getMonth() + 1;
        if (input.indexOf('Standard') !== -1) {
            switch (month) {
                case 1:
                case 2:
                case 3:
                    return '23808'; // 17.50 - Affiliated (Jan-Mar)
                case 4:
                case 5:
                case 6:
                    return '21591'; // 25.00 - Affiliated (Apr-Mar)
                case 7:
                case 8:
                case 9:
                    return '22431'; // 22.50 - Affiliated (Jul-Mar)
                case 10:
                case 11:
                case 12:
                    return '23181'; // 20.00 - Affiliated (Oct-Mar)
            }
        } else {
            switch (month) {
                case 1:
                case 2:
                case 3:
                    return '23807'; //  7.50 - Basic (Jan-Mar)
                case 4:
                case 5:
                case 6:
                    return '21592'; // 15.00 - Basic (Apr-Mar)
                case 7:
                case 8:
                case 9:
                    return '22432'; // 12.50 - Basic (Jul-Mar)
                case 10:
                case 11:
                case 12:
                    return '23182'; // 10.00 - Basic (Oct-Mar)
            }
        }
    }

    function addStyles() {
        var node = document.createElement('style');
        node.innerHTML = `
        .bpj {
            border: 1px dashed #f89829;
            background-color: #fddbb5;
            padding: 10px;
            margin-bottom: 20px;
        }
        .bpj__textarea {
            width: 100%;
            height: 90px;
            border: 1px dashed #f89829;
            background-color: #fef3e6;
            padding: 10px;
            box-sizing: border-box;
        }
    `;
        document.body.appendChild(node);
    }
}
