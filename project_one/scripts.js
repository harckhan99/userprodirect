let usersData = [];

      async function fetchUsers() {
        try {
          const response = await fetch('https://jsonplaceholder.typicode.com/users');
          const users = await response.json();
          usersData = users;

          populateFilters(users);
          renderUsers();
        } catch (error) {
          document.getElementById('loading').innerText = 'Failed to load user data.';
          console.error('Error fetching users:', error);
        }
      }

      function populateFilters(users) {
        const cities = [...new Set(users.map(u => u.address.city))];
        const companies = [...new Set(users.map(u => u.company.name))];

        const citySelect = document.getElementById('filterCity');
        const companySelect = document.getElementById('filterCompany');

        cities.forEach(city => {
          const option = document.createElement('option');
          option.value = city;
          option.textContent = city;
          citySelect.appendChild(option);
        });

        companies.forEach(company => {
          const option = document.createElement('option');
          option.value = company;
          option.textContent = company;
          companySelect.appendChild(option);
        });
      }

      function renderUsers() {
        const container = document.getElementById('user-directory');
        const loading = document.getElementById('loading');
        const search = document.getElementById('searchInput').value.toLowerCase();
        const filterCity = document.getElementById('filterCity').value;
        const filterCompany = document.getElementById('filterCompany').value;

        const filteredUsers = usersData.filter(user => {
          return (
            (user.name.toLowerCase().includes(search) || user.username.toLowerCase().includes(search)) &&
            (filterCity === '' || user.address.city === filterCity) &&
            (filterCompany === '' || user.company.name === filterCompany)
          );
        });

        container.innerHTML = '';

        if (filteredUsers.length === 0) {
          container.innerHTML = '<p class="col-span-full text-center text-gray-500">No users found.</p>';
        } else {
          filteredUsers.forEach(user => {
            const card = document.createElement('div');
            card.className = 'bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow';

            const detailsId = `details-${user.id}`;

            card.innerHTML = `
              <h2 class="text-xl mb-3 text-gray-600 font-semibold">${user.name}</h2>
              <p><span class="font-medium">Email:</span> <a class="text-gray-600" href="mailto:${user.email}">${user.email}</a></p>
              <p><span class="font-medium">Company:</span> ${user.company.name}</p>
              <p><span class="font-medium">City:</span> ${user.address.city}</p>
              <button class="mt-3 text-sm text-white bg-gray-500 hover:bg-red-500 px-4 py-2 rounded" onclick="toggleDetails('${detailsId}')">View More</button>
              <div id="${detailsId}" class="mt-4 hidden">
                <p><span class="font-medium">Phone:</span> ${user.phone}</p>
                <p><span class="font-medium">Website:</span> <a class="text-gray-600" href="http://${user.website}" target="_blank">${user.website}</a></p>
              </div>
            `;

            container.appendChild(card);
          });
        }

        loading.classList.add('hidden');
        container.classList.remove('hidden');
      }

      function toggleDetails(id) {
        const details = document.getElementById(id);
        details.classList.toggle('hidden');
      }

      fetchUsers();