#from django.contrib.postgres.fields import ArrayField
from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class VocabularySets(models.Model):
    title = models.CharField(max_length=45)
    vocEn = models.TextField()
    vocDe = models.TextField()
    user = models.ForeignKey(User, unique=False, on_delete=models.CASCADE)

    def __str__(self):
        return self.title