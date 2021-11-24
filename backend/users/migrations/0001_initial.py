# Generated by Django 3.2.9 on 2021-11-24 21:50

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='Users',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('email', models.EmailField(error_messages={'unique': 'A user with that email already exists.'}, max_length=254, unique=True)),
                ('first_name', models.CharField(error_messages={'first_name': 'first_name must be set.'}, max_length=50)),
                ('last_name', models.CharField(error_messages={'last_name': 'last_name must be set.'}, max_length=50)),
                ('is_active', models.BooleanField(default=True, error_messages={'is_active': 'is_active must be set with a valid boolean value.'})),
                ('last_login', models.DateTimeField(blank=True, error_messages={'last_login': 'last_login must be a valid datetime value.'}, null=True)),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.Group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.Permission', verbose_name='user permissions')),
            ],
            options={
                'db_table': 'USERS',
                'ordering': ('id',),
            },
        ),
    ]
