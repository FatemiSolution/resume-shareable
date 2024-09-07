// import html2pdf from 'html2pdf';

// Function to validate the form fields
function validateForm(): boolean {
    const missingFields: string[] = [];

    const fullName = (document.getElementById('fullName') as HTMLInputElement).value.trim();
    const email = (document.getElementById('email') as HTMLInputElement).value.trim();
    const phone = (document.getElementById('phone') as HTMLInputElement).value.trim();
    const address = (document.getElementById('address') as HTMLInputElement).value.trim();
    const firstSkill = (document.getElementById('skills') as HTMLInputElement).value.trim();

    // Check if all personal information fields are filled
    if (!fullName) missingFields.push('Full Name');
    if (!email) missingFields.push('Email');
    if (!phone) missingFields.push('Phone');
    if (!address) missingFields.push('Address');
    if (!firstSkill) missingFields.push('Primary Skill');

    // Check education fields
    const educationFields = document.querySelectorAll('#education textarea');
    educationFields.forEach((field) => {
        if ((field as HTMLTextAreaElement).value.trim() === '') {
            missingFields.push('Education Details');
        }
    });

    // Check experience fields
    const experienceFields = document.querySelectorAll('#experience textarea');
    experienceFields.forEach((field) => {
        if ((field as HTMLTextAreaElement).value.trim() === '') {
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
    const greetingSection = document.querySelector('.greeting-section') as HTMLElement;

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
    const fullName = (document.getElementById('fullName') as HTMLInputElement).value;
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const phone = (document.getElementById('phone') as HTMLInputElement).value;
    const address = (document.getElementById('address') as HTMLInputElement).value;

    // Capture education and experience fields
    const educationFields = document.querySelectorAll('#education, #additionalEducation textarea');
    const education = Array.prototype.slice.call(educationFields).map((textarea: HTMLTextAreaElement) => textarea.value).join('<br>');

    const experienceFields = document.querySelectorAll('#experience, #additionalExperience textarea');
    const experience = Array.prototype.slice.call(experienceFields).map((textarea: HTMLTextAreaElement) => textarea.value).join('<br>');

    // Capture skills
    const firstSkill = (document.getElementById('skills') as HTMLInputElement).value;
    const additionalSkills = document.querySelectorAll('#additionalSkills input');
    const allSkills = [firstSkill, ...Array.prototype.slice.call(additionalSkills).map((input: HTMLInputElement) => input.value)];

    // Load and display profile image
    const imageInput = document.getElementById('profileImage') as HTMLInputElement;
    const imageElement = document.querySelector('.profile-pic') as HTMLImageElement;
    if (imageInput?.files?.length) {
        const imageUrl = URL.createObjectURL(imageInput.files[0]);
        imageElement.src = imageUrl;
    }

    // Inject data into the resume
    document.querySelector('.personal-info h1')!.textContent = fullName;
    document.querySelector('.personal-info p:nth-of-type(1)')!.textContent = email;
    document.querySelector('.personal-info p:nth-of-type(2)')!.textContent = phone;
    document.querySelector('.personal-info p:nth-of-type(3)')!.textContent = address;

    // Display the list of education, experience, and skills
    document.getElementById('educationSection')!.innerHTML = `<h2>Education</h2><p>${education}</p>`;
    document.getElementById('experienceSection')!.innerHTML = `<h2>Experience</h2><p>${experience}</p>`;
    document.getElementById('skillsSection')!.innerHTML = `<h2>Skills</h2><ul>${allSkills.map(skill => `<li>${skill}</li>`).join('')}</ul>`;

    // Hide the form and display the resume
    document.getElementById('resumeFormSection')!.style.display = 'none';
    document.getElementById('generatedResume')!.style.display = 'block';

    // Generate unique URL
    const uniqueURL = `${window.location.origin}/${fullName}/resume`;
    const generatedLink = document.getElementById('generatedLink')!;
    generatedLink.textContent = uniqueURL;
    document.getElementById('shareableLink')!.style.display = 'block';
});

// Add additional fields for education, experience, and skills
document.getElementById('addEducationButton')?.addEventListener('click', () => {
    const newEducation = document.createElement('textarea');
    newEducation.placeholder = 'Enter more education details';
    newEducation.required = true;
    document.getElementById('additionalEducation')?.appendChild(newEducation);
});

document.getElementById('addExperienceButton')?.addEventListener('click', () => {
    const newExperience = document.createElement('textarea');
    newExperience.placeholder = 'Enter more experience details';
    newExperience.required = true;
    document.getElementById('additionalExperience')?.appendChild(newExperience);
});

document.getElementById('addSkillButton')?.addEventListener('click', () => {
    const newSkill = document.createElement('input');
    newSkill.placeholder = 'Enter a skill';
    newSkill.type = 'text';
    newSkill.required = true;
    document.getElementById('additionalSkills')?.appendChild(newSkill);
});

// Print Resume
document.getElementById('printResumeButton')?.addEventListener('click', () => {
    window.print();
});

// Download Resume as HTML
document.getElementById('downloadResumeButton')?.addEventListener('click', () => {
    const resumeContent = document.querySelector('.container')!.innerHTML;
    const blob = new Blob([resumeContent], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'resume.html';
    link.click();
});

// Share Resume or Copy Link
document.getElementById('copyLinkButton')?.addEventListener('click', () => {
    const url = document.getElementById('generatedLink')!.textContent!;
    navigator.clipboard.writeText(url).then(() => {
        alert('Link copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy link:', err);
    });
});

document.getElementById('shareResumeButton')?.addEventListener('click', () => {
    const url = document.getElementById('generatedLink')!.textContent!;
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
    const fullName = (document.getElementById('fullName') as HTMLInputElement).value;
    const resumeElement = document.getElementById('generatedResume')!;
    const opt = {
        margin: 1,
        filename: `${fullName}_resume.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().from(resumeElement).set(opt).save();
});
