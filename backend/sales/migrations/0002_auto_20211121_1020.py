# Generated by Django 3.2.9 on 2021-11-21 13:20

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0001_initial'),
        ('sales', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='sales',
            name='invoice_id',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='invoice', to='sales.invoices'),
        ),
        migrations.AlterField(
            model_name='sales',
            name='product_id',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='product', to='products.products'),
        ),
    ]