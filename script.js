var slideImg = document.getElementById('slideImg');

var images = new Array (
    "./assets/2.jpeg",
    "./assets/3.jpeg",
    "./assets/4.jpeg",
    "./assets/5.jpeg",
);

var len = images.length;
var i = 0;

function slider () {
    if (i > len - 1){
        i = 0;
    }
    slideImg.src = images[i];
    i++;
    setTimeout('slider()', 3000);
}

let filteredData = [];

fetch('data.json')
  .then(response => response.json())
  .then(data => {
    filteredData = data.employees;
    renderEmployeeCards(filteredData);

    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', handleSearch);

    const designationFilter = document.getElementById('designationFilter');
    designationFilter.addEventListener('change', handleFilter);

    const skillsFilter = document.getElementById('skillsFilter');
    skillsFilter.addEventListener('change', handleFilter);
  })
  .catch(error => {
    console.error('Error:', error);
  });

function renderEmployeeCards(employees) {
  const employeeContainer = document.getElementById('employeeContainer');
  employeeContainer.innerHTML = '';

  employees.forEach(employee => {
    const card = createEmployeeCard(employee);
    employeeContainer.appendChild(card);
  });
}

function createEmployeeCard(employee) {
  const card = document.createElement('div');
  card.classList.add('employee-card');

  const name = document.createElement('h2');
  name.textContent = employee.name;
  card.appendChild(name);

  const designation = document.createElement('p');
  designation.textContent = `Designation: ${employee.designation || 'N/A'}`;
  card.appendChild(designation);

  const skillsHeading = document.createElement('p');
  skillsHeading.textContent = 'Skills:';
  card.appendChild(skillsHeading);

  const skillsList = document.createElement('ul');
  employee.skills.forEach(skill => {
    const skillItem = document.createElement('li');
    skillItem.textContent = skill;
    skillsList.appendChild(skillItem);
  });
  card.appendChild(skillsList);

  const projectsHeading = document.createElement('p');
  projectsHeading.textContent = 'Projects:';
  card.appendChild(projectsHeading);

  if (employee.projects && employee.projects.length > 0) {
    const projectsList = document.createElement('ul');
    employee.projects.forEach(project => {
      const projectItem = document.createElement('li');
      const projectTitle = document.createElement('h3');
      projectTitle.textContent = project.name;
      projectItem.appendChild(projectTitle);

      const description = document.createElement('p');
      description.textContent = project.description || 'No description available';
      projectItem.appendChild(description);

      const teamHeading = document.createElement('p');
      teamHeading.textContent = 'Team:';
      projectItem.appendChild(teamHeading);

      const teamList = document.createElement('ul');
      project.team.forEach(member => {
        const memberItem = document.createElement('li');
        memberItem.textContent = `${member.name || 'Unknown'} - ${member.role}`;
        teamList.appendChild(memberItem);
      });
      projectItem.appendChild(teamList);

      if (project.tasks && project.tasks.length > 0) {
        const tasksHeading = document.createElement('p');
        tasksHeading.textContent = 'Tasks:';
        projectItem.appendChild(tasksHeading);

        const tasksList = document.createElement('ul');
        project.tasks.forEach(task => {
          const taskItem = document.createElement('li');
          taskItem.textContent = `${task.name} - ${task.status || 'Not specified'}`;
          tasksList.appendChild(taskItem);
        });
        projectItem.appendChild(tasksList);
      }

      projectsList.appendChild(projectItem);
    });
    card.appendChild(projectsList);
  } else {
    const noProjects = document.createElement('p');
    noProjects.textContent = 'No projects assigned.';
    card.appendChild(noProjects);
  }

  return card;
}

function handleSearch() {
  const searchInput = document.getElementById('searchInput');
  const searchTerm = searchInput.value.toLowerCase();

  filteredData = data.employees.filter(employee => employee.name.toLowerCase().includes(searchTerm));
  renderEmployeeCards(filteredData);
}

function handleFilter() {
  const designationFilter = document.getElementById('designationFilter');
  const selectedDesignation = designationFilter.value;

  const skillsFilter = document.getElementById('skillsFilter');
  const selectedSkills = skillsFilter.value;

  filteredData = data.employees.filter(employee => {
    const hasDesignation = selectedDesignation === '' || employee.designation === selectedDesignation;
    const hasSkills = selectedSkills === '' || employee.skills.includes(selectedSkills);
    return hasDesignation && hasSkills;
  });

  renderEmployeeCards(filteredData);
}
