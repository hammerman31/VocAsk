from django.contrib.postgres.fields import ArrayField
from django.db import models

# Create your models here.
class VocabularySets(models.Model):
    vocEn = ArrayField(ArrayField(models.CharField(max_length=10)))
    vocDe = ArrayField(ArrayField(models.CharField(max_length=10)))