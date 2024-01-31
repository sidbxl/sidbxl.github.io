$(document).ready(function() {

    $('#search-button').click(function() {
        var searchQuery = $('#search-field').val();
    
        $.ajax({
            url: 'https://api.github.com/search/repositories?q=' + encodeURIComponent(searchQuery),
            method: 'GET',
            success: function(response) {
                // Clear the search field
                $('#search-field').val('');
    
                // Add the found projects to the textarea
                var projectUrls = response.items.map(function(item) {
                    return item.html_url;
                }).join('\n');
    
                $('#project-urls').val(projectUrls);
            },
            error: function() {
                alert('An error occurred while searching for projects.');
            }
        });
    });

    var projects = JSON.parse(localStorage.getItem('projects')) || [];

    $('#add-projects').click(function() {
        var projectUrls = $('#project-urls').val().split('\n');

        projectUrls.forEach(function(projectUrl) {
            projectUrl = projectUrl.replace(/\/+$/, '');
            var projectName = projectUrl.split('/').slice(-2).join('/');

            $.get('https://api.github.com/repos/' + projectName, function(repoData) {
                $.get('https://api.github.com/repos/' + projectName + '/releases', function(releasesData) {
                    if (releasesData && releasesData.length > 0) {
                        repoData.latest_release_date = releasesData[0].created_at; // Get the latest release date
                    } else {
                        repoData.latest_release_date = 'No releases'; // Handle repositories with no releases
                    }
                    projects.push(repoData);
                    saveProjects();
                    renderProjects();
                });
            });
        });
        $('#project-urls').val('');
    });

    $('#sort-method').change(function() {
        renderProjects();
    });

    function saveProjects() {
        localStorage.setItem('projects', JSON.stringify(projects));
    }

    function renderProjects() {
        var sortMethod = $('#sort-method').val();

        // Sort the projects array based on the selected sort method
        projects.sort(function(a, b) {
            if (a[sortMethod] < b[sortMethod]) {
                return 1;
            } else if (a[sortMethod] > b[sortMethod]) {
                return -1;
            } else {
                return 0;
            }
        });

        var mostStars = Math.max.apply(Math, projects.map(function(project) { return project.stargazers_count; }));
        var earliestUpdate = Math.min.apply(Math, projects.map(function(project) { return new Date(project.updated_at).getTime(); }));
        var mostForks = Math.max.apply(Math, projects.map(function(project) { return project.forks_count; }));
        var mostWatchers = Math.max.apply(Math, projects.map(function(project) { return project.watchers_count; }));


        // Clear the project info container
        $('.project-info').empty();

        projects.forEach(function(project, index) {
            var projectCard = `
                <div class="project-card card">
                    <div class='card-body'>
                        <button class="remove-project" data-index="${index}"><i class="fa fa-times" aria-hidden="true"></i></button>
                        <h2 class='card-title' data-bs-toggle="tooltip" data-bs-placement="top" title="${project.description}"><a href="${project.html_url}" target="_blank">${project.name}</a></h2>
                        <hr class='divide'>
                        <p class='card-text'><i class="fa fa-calendar" aria-hidden="true"></i> ${new Date(project.updated_at).toLocaleDateString()}</p>
                        <p class='card-text'><i class="fa fa-star" aria-hidden="true"></i> ${project.stargazers_count}</p>
                        <p class='card-text'><i class="fa fa-eye" aria-hidden="true"></i> ${project.watchers_count}</p>
                        <p class='card-text'><i class="fa fa-code-fork" aria-hidden="true"></i> ${project.forks_count}</p>
                    </div>
                    <div class='card-footer'>
                    <a href="${project.homepage}" target="_blank"><i class="align-top fa fa-globe" aria-hidden="true"></i></a>
                    </div>
                </div>
            `;

            var $projectCard = $(projectCard);

            // If the current project has the most stars, append a <p> to the card-footer
            if (project.stargazers_count === mostStars) {
                $projectCard.find('.card-footer').append(`
                    <i class="align-top fa fa-star text-success" aria-hidden="true"></i>
                `);
            }

            // If the current project has the earliest last update date, append a <p> to the card-footer
            if (new Date(project.updated_at).getTime() === earliestUpdate) {
                $projectCard.find('.card-footer').append(`
                    <i class="align-top fa fa-calendar text-danger" aria-hidden="true"></i>
                `);
            }

            // If the current project has the most forks, append a <p> to the card-footer
            if (project.forks_count === mostForks) {
                $projectCard.find('.card-footer').append(`
                    <i class="align-top fa fa-code-fork text-success" aria-hidden="true"></i>
                `);
            }

            // If the current project has the most watchers, append a <p> to the card-footer
            if (project.watchers_count === mostWatchers) {
                $projectCard.find('.card-footer').append(`
                    <i class="align-top fa fa-eye text-success" aria-hidden="true"></i>
                `);
            }

            $('.project-info').append($projectCard);
        });
        
        $('.remove-project').click(function() {
            var index = $(this).data('index');
            projects.splice(index, 1);
            saveProjects();
            renderProjects();
        });
    }

    // Initial render
    renderProjects();
});