<?php

namespace App\Exceptions;

use Exception;

class CityNotFoundException extends Exception
{
    public function __construct(string $city)
    {
        parent::__construct("We couldn't find a city matching \"{$city}\".");
    }
}
