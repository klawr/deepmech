
"""
Idea 1

The input is an image and a tensor of the detected nodes with their respective
coordinates (resulting in a (b x n x 2) shaped tensor).

We do not care for the detected class or size of the object.

The number of possible connections is c = (n x (n - 1)) / 2:
Each node can be connected to each other one (n x n - 1), but we only care for
the connection, not for the direction (for the moment...).

The output is therefore a tensor of (b x c x (c - 1))

==> How do we create an output of variable size?
---------------------------------------------------------------------
Idea 2

The input is an image. The output is the regular old fashioned YOLO output, but
in addition to the regular output we put another objectness score to it.
So we add 3 values to each prediction: 
 - a score how likely it is that there is actually a constraint. 
 - the x and y offset of the connected point.
    the scaling is another question...
"""

