close all;
clear;
clc;

addpath('jsonlab-1.5');
load('mask.mat');

Bound.x = 566;
Bound.y = 395;
exetremumCount = 1;
[x, y] = meshgrid(1:Bound.x, 1:Bound.y);
maskSurface = surf(x, y, Mask);
shading flat;
alpha(0.25);
hold on;

for x = 2:Bound.x - 1

    for y = 2:Bound.y - 1

        if Mask(y, x) > 1e-4 && ...
                Mask(y, x) < Mask(y - 1, x) && Mask(y, x) < Mask(y + 1, x) && ...
                Mask(y, x) < Mask(y, x - 1) && Mask(y, x) < Mask(y, x + 1)
            exetremum(exetremumCount).x = x;
            exetremum(exetremumCount).y = y;
            exetremum(exetremumCount).mask = Mask(y, x);
            exetremumCount = exetremumCount + 1;
            plot3(x, y, Mask(y, x), '.', 'Markersize', 16);
        end

    end

end

savejson('exetremum', exetremum, 'exetremum.json');
