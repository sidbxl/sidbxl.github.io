$(document).ready(function() {

    var githubToken = "";

    $('#search-button').click(function() {
        var searchType = $('#search-type').val();
        var searchQuery = $('#search-field').val();

        if (searchType === 'username') {
            fetchStarredProjects(searchQuery);
        } else {
            $.ajax({
                url: 'https://api.github.com/search/repositories?q=' + encodeURIComponent(searchQuery),
                method: 'GET',
                headers: {
                    'Authorization': 'token ' + githubToken
                },
                success: function(response) {
                    $('#search-field').val('');

                    var projectUrls = response.items.map(function(item) {
                        return item.html_url;
                    }).join('\n');

                    $('#project-urls').val(projectUrls);
                },
                error: function() {
                    alert('An error occurred while searching for projects.');
                }
            });
        }
    });

    $('purge-button').click(function() {
        //purge
    });

    function fetchStarredProjects(username) {
        var url = 'https://api.github.com/users/' + encodeURIComponent(username) + '/starred';
        $.ajax({
            url: 'https://api.github.com/users/' + encodeURIComponent(username) + '/starred',
            method: 'GET',
            headers: {
                'Authorization': 'token ' + githubToken
            },
            success: function(response) {
                var projectUrls = response.map(function(repo) {
                    return repo.html_url;
                }).join('\n');

                $('#project-urls').val(projectUrls);
            },
            error: function() {
                alert('An error occurred while fetching starred projects.');
            }
        });
    }

    var projects = JSON.parse(localStorage.getItem('projects')) || [];

    $('#add-projects').click(function() {
        var projectUrls = $('#project-urls').val().split('\n');
    
        projectUrls.forEach(function(projectUrl) {
            projectUrl = projectUrl.replace(/\/+$/, '');
            var projectName = projectUrl.split('/').slice(-2).join('/');
    
            if (!projects.some(proj => proj.html_url === projectUrl)) {
                $.ajax({
                    url: 'https://api.github.com/repos/' + projectName,
                    method: 'GET',
                    headers: {
                        'Authorization': 'token ' + githubToken
                    },
                    success: function(repoData) {
                        $.ajax({
                            url: 'https://api.github.com/repos/' + projectName + '/releases',
                            method: 'GET',
                            headers: {
                                'Authorization': 'token ' + githubToken
                            },
                            success: function(releasesData) {
                                if (releasesData && releasesData.length > 0) {
                                    repoData.latest_release_date = releasesData[0].created_at;
                                } else {
                                    repoData.latest_release_date = 'No releases';
                                }
                                projects.push(repoData);
                                saveProjects();
                                renderProjects();
                            }
                        });
                    }
                });
            }
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
            var aValue = a[sortMethod] || 0; // Fallback to 0 if undefined or null
            var bValue = b[sortMethod] || 0;
        
            if (aValue < bValue) {
                return 1;
            } else if (aValue > bValue) {
                return -1;
            } else {
                return 0;
            }
        });

        var mostStars = Math.max.apply(Math, projects.map(function(project) { return project.stargazers_count; }));
        // var earliestUpdate = Math.min.apply(Math, projects.map(function(project) { return new Date(project.updated_at).getTime(); }));
        var validReleaseDates = projects.filter(function(project) {
            return project.latest_release_date !== 'No releases';
        }).map(function(project) {
            var date = new Date(project.latest_release_date).getTime();
            return isNaN(date) ? null : date;
        }).filter(function(date) {
            return date !== null;
        });
        var lastRelease = validReleaseDates.length > 0 ? Math.max.apply(Math, validReleaseDates) : null;
        var mostForks = Math.max.apply(Math, projects.map(function(project) { return project.forks_count; }));
        // var mostWatchers = Math.max.apply(Math, projects.map(function(project) { return project.watchers_count; }));

        // Clear the project info container
        $('.project-info').empty();

        projects.forEach(function(project, index) {
            var latestReleaseDate = new Date(project.latest_release_date).toLocaleDateString();
            if (latestReleaseDate != "Invalid Date") {
                var latestReleaseDatetoText = `<p class='card-text'><i class="fa fa-tag" aria-hidden="true"></i> `+latestReleaseDate+`</p>`;
            } else {
                var latestReleaseDatetoText = `<p class='card-text'><i class="fa fa-tag" aria-hidden="true"></i> No Release</p>`;
            }

            var projectCard = `
                <div class="project-card card">
                    <div class='card-body'>
                        <button class="remove-project" data-index="${index}"><i class="fa fa-times" aria-hidden="true"></i></button>
                        <h2 class='card-title' data-bs-toggle="tooltip" data-bs-placement="top" title="${project.description}"><a href="${project.html_url}" target="_blank">${project.name}</a></h2>
                        <hr class='divide'>
                        `+latestReleaseDatetoText+`
                        <p class='card-text'><i class="fa fa-star" aria-hidden="true"></i> ${project.stargazers_count}</p>
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
            // if (new Date(project.updated_at).getTime() === earliestUpdate) {
            //     $projectCard.find('.card-footer').append(`
            //         <i class="align-top fa fa-calendar text-danger" aria-hidden="true"></i>
            //     `);
            // }
            
            if (project.latest_release_date !== 'No releases' && new Date(project.latest_release_date).getTime() === lastRelease) {
                $projectCard.find('.card-footer').append(`
                    <i class="align-top fa fa-tag text-success" aria-hidden="true"></i>
                `);
            }
            
            
            // If the current project has the most forks, append a <p> to the card-footer
            if (project.forks_count === mostForks) {
                $projectCard.find('.card-footer').append(`
                    <i class="align-top fa fa-code-fork text-success" aria-hidden="true"></i>
                `);
            }

            // If the current project has the most watchers, append a <p> to the card-footer
            // if (project.watchers_count === mostWatchers) {
            //     $projectCard.find('.card-footer').append(`
            //         <i class="align-top fa fa-eye text-success" aria-hidden="true"></i>
            //     `);
            // }

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