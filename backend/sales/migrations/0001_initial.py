# Generated by Django 3.2.9 on 2021-11-22 15:56

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('products', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Invoices',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('taxes', models.DecimalField(decimal_places=2, max_digits=8)),
                ('gross_total', models.DecimalField(decimal_places=2, max_digits=8)),
                ('net_total', models.DecimalField(decimal_places=2, max_digits=8)),
                ('emitted_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'db_table': 'INVOICES',
                'ordering': ('id',),
            },
        ),
        migrations.CreateModel(
            name='Sales',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.IntegerField()),
                ('customers_name', models.CharField(blank=True, max_length=50)),
                ('customers_cpf', models.CharField(blank=True, max_length=14)),
                ('purchase_date', models.DateTimeField(auto_now_add=True)),
                ('invoice_id', models.ForeignKey(db_column='invoice_id', null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='invoice', to='sales.invoices')),
                ('product_id', models.ForeignKey(db_column='product_id', null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='product', to='products.products')),
            ],
            options={
                'db_table': 'SALES',
                'ordering': ('id',),
            },
        ),
    ]
