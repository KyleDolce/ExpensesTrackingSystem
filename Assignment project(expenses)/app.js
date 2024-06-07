$(document).ready(function() {
    // Initialize expenses array
    let userExpenses = JSON.parse(localStorage.getItem('${loggedInUser}_expenses')) || [];

    // Function to render expenses for editing/deleting
    function renderExpenses() {
        $('#expense-list').empty();
        expenses.forEach((expense, index) => {
            $('#expense-list').append(`
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    ${expense.description} - $${expense.amount} on ${expense.date}
                    <div>
                        <button class="btn btn-sm btn-warning edit-expense" data-index="${index}">Edit</button>
                        <button class="btn btn-sm btn-danger delete-expense" data-index="${index}">Delete</button>
                    </div>
                </li>
            `);
        });
    }

    // Function to update summary
    function updateSummary() {
        let total = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
        $('#summary').text(`Total Expenses: $${total.toFixed(2)}`);
    }

    // Function to update chart
    function updateChart() {
        let ctx = document.getElementById('expenseChart').getContext('2d');
        let chartData = expenses.reduce((acc, expense) => {
            let month = new Date(expense.date).toLocaleString('default', { month: 'long' });
            if (!acc[month]) {
                acc[month] = 0;
            }
            acc[month] += parseFloat(expense.amount);
            return acc;
        }, {});

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(chartData),
                datasets: [{
                    label: 'Expenses by Month',
                    data: Object.values(chartData),
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Add expense
    $('#expense-form').on('submit', function(event) {
        event.preventDefault();
        let newExpense = {
            amount: $('#amount').val(),
            date: $('#date').val(),
            description: $('#description').val()
        };
        expenses.push(newExpense);
        localStorage.setItem('expenses', JSON.stringify(expenses));
        this.reset();
        alert('Expense added successfully!');
    });

    // Edit expense
    $(document).on('click', '.edit-expense', function() {
        let index = $(this).data('index');
        let expense = expenses[index];
        $('#amount').val(expense.amount);
        $('#date').val(expense.date);
        $('#description').val(expense.description);
        expenses.splice(index, 1);
        localStorage.setItem('expenses', JSON.stringify(expenses));
        renderExpenses();
    });

    // Delete expense
    $(document).on('click', '.delete-expense', function() {
        let index = $(this).data('index');
        expenses.splice(index, 1);
        localStorage.setItem('expenses', JSON.stringify(expenses));
        renderExpenses();
    });

    // Page-specific initialization
    if (window.location.pathname.endsWith('edit_delete_expense.html')) {
        renderExpenses();
    } else if (window.location.pathname.endsWith('summary.html')) {
        updateSummary();
        updateChart();
    }
});
