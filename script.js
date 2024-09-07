// Import html2pdf (Assuming you have included the html2pdf library via a script tag)
// import html2pdf from 'html2pdf';

// Function to validate the form fields
function validateForm() {
    const missingFields = [];

    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    const firstSkill = document.getElementById('skills').value.trim();

    // Check if all personal information fields are filled
    if (!fullName) missingFields.push('Full Name');
    if (!email) missingFields.push('Email');
    if (!phone) missingFields.push('Phone');
    if (!address) missingFields.push('Address');
    if (!firstSkill) missingFields.push('Primary Skill');

    // Check education fields
    const educationFields = document.querySelectorAll('#education textarea');
    educationFields.forEach((field) => {
        if (field.value.trim() === '') {
            missingFields.push('Education Details');
        }
    });

    // Check experience fields
    const experienceFields = document.querySelectorAll('#experience textarea');
    experienceFields.forEach((field) => {
        if (field.value.trim() === '') {
            missingFields.push('Experience Details');
        }
    });

    // Show an alert if there are any missing fields
    if (missingFields.length > 0) {
        alert(`Please complete the following fields:\n- ${missingFields.join('\n- ')}`);
        return false;
    }

    return true;
}

// Event listener for "Create Your Resume" button
document.getElementById('startResumeButton')?.addEventListener('click', () => {
    // Check if the resume form section and greeting section exist
    const resumeFormSection = document.getElementById('resumeFormSection');
    const greetingSection = document.querySelector('.greeting-section');

    if (resumeFormSection && greetingSection) {
        // Show the resume form section
        resumeFormSection.style.display = 'block';
        // Hide the greeting section
        greetingSection.style.display = 'none';
    } else {
        console.error('Error: resumeFormSection or greetingSection not found.');
    }
});

// Generate Resume Logic
document.getElementById('generateResumeButton')?.addEventListener('click', () => {
    if (!validateForm()) {
        return; // Stop execution if validation fails
    }

    // Capture personal information
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;

    // Capture education and experience fields
    const educationFields = document.querySelectorAll('#education, #additionalEducation textarea');
    const education = Array.prototype.slice.call(educationFields).map((textarea) => textarea.value).join('<br>');

    const experienceFields = document.querySelectorAll('#experience, #additionalExperience textarea');
    const experience = Array.prototype.slice.call(experienceFields).map((textarea) => textarea.value).join('<br>');

    // Capture skills
    const firstSkill = document.getElementById('skills').value;
    const additionalSkills = document.querySelectorAll('#additionalSkills input');
    const allSkills = [firstSkill, ...Array.prototype.slice.call(additionalSkills).map((input) => input.value)];

    // Load and display profile image
    const imageInput = document.getElementById('profileImage');
    const imageElement = document.querySelector('.profile-pic');
    if (imageInput?.files?.length) {
        const imageUrl = URL.createObjectURL(imageInput.files[0]);
        imageElement.src = imageUrl;
    }

    // Inject data into the resume
    document.querySelector('.personal-info h1').textContent = fullName;
    document.querySelector('.personal-info p:nth-of-type(1)').textContent = email;
    document.querySelector('.personal-info p:nth-of-type(2)').textContent = phone;
    document.querySelector('.personal-info p:nth-of-type(3)').textContent = address;

    // Display the list of education, experience, and skills
    document.getElementById('educationSection').innerHTML = `<h2>Education</h2><p>${education}</p>`;
    document.getElementById('experienceSection').innerHTML = `<h2>Experience</h2><p>${experience}</p>`;
    document.getElementById('skillsSection').innerHTML = `<h2>Skills</h2><ul>${allSkills.map(skill => `<li>${skill}</li>`).join('')}</ul>`;

    // Hide the form and display the resume
    document.getElementById('resumeFormSection').style.display = 'none';
    document.getElementById('generatedResume').style.display = 'block';

    // Generate unique URL
    const uniqueURL = `${window.location.origin}/${fullName}/resume`;
    const generatedLink = document.getElementById('generatedLink');
    generatedLink.textContent = uniqueURL;
    document.getElementById('shareableLink').style.display = 'block';
});

// Add additional fields for education, experience, and skills
document.getElementById('addEducationButton')?.addEventListener('click', () => {
    const newEducation = document.createElement('textarea');
    newEducation.placeholder = 'Enter more education details';
    newEducation.required = true;
    document.getElementById('additionalEducation').appendChild(newEducation);
});

document.getElementById('addExperienceButton')?.addEventListener('click', () => {
    const newExperience = document.createElement('textarea');
    newExperience.placeholder = 'Enter more experience details';
    newExperience.required = true;
    document.getElementById('additionalExperience').appendChild(newExperience);
});

document.getElementById('addSkillButton')?.addEventListener('click', () => {
    const newSkill = document.createElement('input');
    newSkill.placeholder = 'Enter a skill';
    newSkill.type = 'text';
    newSkill.required = true;
    document.getElementById('additionalSkills').appendChild(newSkill);
});

// Print Resume
document.getElementById('printResumeButton')?.addEventListener('click', () => {
    window.print();
});

// Download Resume as HTML
document.getElementById('downloadResumeButton')?.addEventListener('click', () => {
    const resumeContent = document.querySelector('.container').innerHTML;
    const blob = new Blob([resumeContent], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'resume.html';
    link.click();
});

// Share Resume or Copy Link
document.getElementById('copyLinkButton')?.addEventListener('click', () => {
    const url = document.getElementById('generatedLink').textContent;
    navigator.clipboard.writeText(url).then(() => {
        alert('Link copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy link:', err);
    });
});

document.getElementById('shareResumeButton')?.addEventListener('click', () => {
    const url = document.getElementById('generatedLink').textContent;
    if (navigator.share) {
        navigator.share({
            title: 'My Resume',
            url: url
        }).catch(error => console.error('Error sharing resume:', error));
    } else {
        alert('Share functionality is not supported in your browser.');
    }
});

// Download Resume as PDF
document.getElementById('downloadResumeButton')?.addEventListener('click', () => {
    const fullName = document.getElementById('fullName').value;
    const resumeElement = document.getElementById('generatedResume');
    const opt = {
        margin: 1,
        filename: `${fullName}_resume.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().from(resumeElement).set(opt).save();
});


// Selecting all editable sections
const educationSection = document.getElementById('educationSection');
const experienceSection = document.getElementById('experienceSection');

// Function to make content editable
function makeSectionEditable(section) {
    section.addEventListener('click', () => {
        section.setAttribute('contenteditable', 'true');
        section.focus(); // Focus on the section to start editing
    });

    // Save changes when user clicks outside or presses "Enter"
    section.addEventListener('blur', () => {
        section.setAttribute('contenteditable', 'false');
        // Optionally, you can save the changes to local storage here
        saveChanges(section);
    });
    
    section.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent default line break
            section.setAttribute('contenteditable', 'false');
            saveChanges(section);
        }
    });
}

// Function to save changes to local storage or other storage
function saveChanges(section) {
    const content = section.innerHTML;
    // Save the content somewhere, like local storage or backend
    console.log(`Content saved for ${section.id}: ${content}`);
}

// Apply the functionality to each editable section if they exist
if (educationSection) makeSectionEditable(educationSection);
if (experienceSection) makeSectionEditable(experienceSection);
